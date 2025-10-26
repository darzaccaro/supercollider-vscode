import * as vscode from 'vscode';
import * as child_process from 'child_process';
import {
    LanguageClient,
    LanguageClientOptions,
    ServerOptions,
    StreamInfo
} from 'vscode-languageclient/node';
import { SuperColliderConfig } from './config';
import * as net from 'net';

export class SuperColliderLanguageClient {
    private client: LanguageClient | null = null;
    private sclangProcess: child_process.ChildProcess | null = null;
    private config: SuperColliderConfig;
    private outputChannel: vscode.OutputChannel | null = null;

    constructor(config: SuperColliderConfig) {
        this.config = config;
        // Create output channel for sclang
        this.outputChannel = vscode.window.createOutputChannel('SuperCollider');
    }

    private log(message: string): void {
        if (this.outputChannel) {
            this.outputChannel.appendLine(message);
        }
    }

    private show(): void {
        if (this.outputChannel) {
            this.outputChannel.show(true); // true = preserveFocus
        }
    }

    async start(_context: vscode.ExtensionContext): Promise<void> {
        if (!this.config.useLanguageServer) {
            console.log('Language Server disabled in configuration');
            return;
        }

        try {
            // Check if LanguageServer Quark is available
            // For now, we'll attempt to connect to a running language server
            const serverOptions: ServerOptions = this.createServerOptions();
            
            const clientOptions: LanguageClientOptions = {
                documentSelector: [
                    { scheme: 'file', language: 'supercollider' }
                ],
                synchronize: {
                    fileEvents: vscode.workspace.createFileSystemWatcher('**/*.{sc,scd}')
                },
                // Suppress all error popups from the language client
                errorHandler: {
                    error: () => ({ action: 1 }), // Continue
                    closed: () => ({ action: 2 }) // Don't restart
                }
            };

            this.client = new LanguageClient(
                'supercollider',
                'SuperCollider Language Server',
                serverOptions,
                clientOptions
            );

            await this.client.start();
            console.log('SuperCollider Language Server started');
        } catch (err) {
            // LSP is optional - silently fail
            this.client = null;
        }
    }

    private createServerOptions(): ServerOptions {
        // Try to connect to an existing language server via TCP
        const serverOptions: ServerOptions = () => {
            return new Promise<StreamInfo>((resolve, reject) => {
                const socket = net.connect({
                    port: this.config.languageServerPort,
                    host: this.config.oscHost
                });

                socket.on('connect', () => {
                    resolve({
                        reader: socket,
                        writer: socket
                    });
                });

                socket.on('error', (err) => {
                    reject(err);
                });

                // Timeout after 5 seconds
                setTimeout(() => {
                    reject(new Error('Connection timeout'));
                }, 5000);
            });
        };

        return serverOptions;
    }

    async startSclangWithLanguageServer(): Promise<void> {
        if (this.sclangProcess) {
            vscode.window.showInformationMessage('sclang is already running');
            return;
        }

        try {
            // Start sclang with a command to initialize the language server
            // This is a simplified approach - actual implementation may vary
            const initCode = `LanguageServer.start(${this.config.languageServerPort});`;
            
            this.sclangProcess = child_process.spawn(
                this.config.sclangPath,
                [], // No special flags - we want all output
                {
                    stdio: ['pipe', 'pipe', 'pipe']
                }
            );

            // Wait a moment for sclang to initialize
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Send initialization code
            if (this.sclangProcess.stdin) {
                this.sclangProcess.stdin.write(initCode + '\n');
            }

            this.sclangProcess.stdout?.on('data', (data) => {
                const output = data.toString();
                const cleanOutput = output.replace(/\x1B\[[0-9;]*[a-zA-Z]/g, '');
                this.log(cleanOutput.trimEnd());
                console.log('sclang stdout:', output);
            });

            this.sclangProcess.stderr?.on('data', (data) => {
                const output = data.toString();
                const cleanOutput = output.replace(/\x1B\[[0-9;]*[a-zA-Z]/g, '');
                this.log('ERROR: ' + cleanOutput.trimEnd());
                console.error('sclang stderr:', output);
            });

            this.sclangProcess.on('exit', (code) => {
                this.log(`\nsclang exited with code ${code}\n`);
                console.log('sclang exited with code', code);
                this.sclangProcess = null;
            });

            vscode.window.showInformationMessage('Started sclang with Language Server');
        } catch (err) {
            vscode.window.showErrorMessage(`Failed to start sclang: ${err}`);
            throw err;
        }
    }

    getSclangProcess(): child_process.ChildProcess | null {
        return this.sclangProcess;
    }

    async startSclang(): Promise<void> {
        if (this.sclangProcess) {
            return; // Already running
        }

        try {
            this.log('Starting SuperCollider (sclang)...');
            this.show();

            // Spawn sclang WITHOUT -i scvim flag (that was silencing output!)
            this.sclangProcess = child_process.spawn(
                this.config.sclangPath,
                [],
                {
                    stdio: ['pipe', 'pipe', 'pipe'],
                    env: process.env
                }
            );

            // Set up output handlers IMMEDIATELY
            this.sclangProcess.stdout?.on('data', (data) => {
                const output = data.toString();
                // Remove ANSI color codes for cleaner output
                const cleanOutput = output.replace(/\x1B\[[0-9;]*[a-zA-Z]/g, '');
                this.log(cleanOutput.trimEnd());
                console.log('[sclang stdout]:', output);
            });

            this.sclangProcess.stderr?.on('data', (data) => {
                const output = data.toString();
                const cleanOutput = output.replace(/\x1B\[[0-9;]*[a-zA-Z]/g, '');
                this.log('ERROR: ' + cleanOutput.trimEnd());
                console.error('[sclang stderr]:', output);
            });

            this.sclangProcess.on('exit', (code) => {
                this.log(`\nsclang exited with code ${code}\n`);
                console.log('[sclang exit]:', code);
                this.sclangProcess = null;
            });

            // Wait for sclang to initialize
            await new Promise(resolve => setTimeout(resolve, 2000));

            this.log('sclang started successfully\n');
        } catch (err) {
            this.log(`Failed to start sclang: ${err}\n`);
            console.error('Failed to start sclang:', err);
            throw err;
        }
    }

    private sendToSclangDirect(code: string): void {
        // Internal method - send without logging to output
        if (this.sclangProcess && this.sclangProcess.stdin) {
            this.sclangProcess.stdin.write(code + '\n');
        }
    }

    sendToSclang(code: string): void {
        if (this.sclangProcess && this.sclangProcess.stdin) {
            // Show output panel when code is evaluated
            this.show();
            
            // Log what we're sending for debugging
            console.log('[Sending to sclang]:', code);
            
            // Send code as-is to sclang
            this.sclangProcess.stdin.write(code + '\n');
        } else {
            console.error('[sendToSclang] No sclang process available!');
            this.log('ERROR: sclang process not available');
        }
    }

    async stop(): Promise<void> {
        if (this.client) {
            await this.client.stop();
            this.client = null;
        }

        if (this.sclangProcess) {
            this.sclangProcess.kill();
            this.sclangProcess = null;
        }

        if (this.outputChannel) {
            this.outputChannel.dispose();
            this.outputChannel = null;
        }
    }

    isRunning(): boolean {
        return this.client !== null;
    }
}

