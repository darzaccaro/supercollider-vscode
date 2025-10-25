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

    constructor(config: SuperColliderConfig) {
        this.config = config;
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
            console.error('Failed to start Language Server:', err);
            vscode.window.showWarningMessage(
                'Could not start SuperCollider Language Server. ' +
                'Make sure the LanguageServer Quark is installed and sclang is running.'
            );
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
                ['-i', 'scvim'],
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
                console.log('sclang stdout:', data.toString());
            });

            this.sclangProcess.stderr?.on('data', (data) => {
                console.error('sclang stderr:', data.toString());
            });

            this.sclangProcess.on('exit', (code) => {
                console.log('sclang exited with code', code);
                this.sclangProcess = null;
            });

            vscode.window.showInformationMessage('Started sclang with Language Server');
        } catch (err) {
            vscode.window.showErrorMessage(`Failed to start sclang: ${err}`);
            throw err;
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
    }

    isRunning(): boolean {
        return this.client !== null;
    }
}

