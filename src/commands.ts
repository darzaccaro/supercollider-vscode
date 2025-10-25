import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import * as child_process from 'child_process';
import { OSCClient } from './oscClient';
import { SuperColliderLanguageClient } from './languageClient';

export class SuperColliderCommands {
    private oscClient: OSCClient;
    private languageClient: SuperColliderLanguageClient;
    private statusBarItem: vscode.StatusBarItem;

    constructor(
        oscClient: OSCClient,
        languageClient: SuperColliderLanguageClient,
        statusBarItem: vscode.StatusBarItem
    ) {
        this.oscClient = oscClient;
        this.languageClient = languageClient;
        this.statusBarItem = statusBarItem;
    }

    async connectOSC(): Promise<void> {
        try {
            if (this.oscClient.isConnected()) {
                vscode.window.showInformationMessage('Already connected to sclang');
                return;
            }

            await this.oscClient.connect();
            vscode.window.showInformationMessage('Connected to sclang via OSC');
            this.updateStatusBar();
        } catch (err) {
            vscode.window.showErrorMessage(
                `Failed to connect to sclang: ${err}. ` +
                'Make sure sclang is running and OSC is enabled.'
            );
        }
    }

    async startLanguageServer(context: vscode.ExtensionContext): Promise<void> {
        try {
            if (this.languageClient.isRunning()) {
                vscode.window.showInformationMessage('Language Server is already running');
                return;
            }

            // Try to start the language server
            await this.languageClient.start(context);
            
            // If start failed, offer to launch sclang
            if (!this.languageClient.isRunning()) {
                const choice = await vscode.window.showWarningMessage(
                    'Language Server is not running. Would you like to start sclang?',
                    'Yes',
                    'No'
                );

                if (choice === 'Yes') {
                    await this.languageClient.startSclangWithLanguageServer();
                    // Try to connect again
                    await new Promise(resolve => setTimeout(resolve, 3000));
                    await this.languageClient.start(context);
                }
            }

            this.updateStatusBar();
        } catch (err) {
            vscode.window.showErrorMessage(`Failed to start Language Server: ${err}`);
        }
    }

    async bootServer(): Promise<void> {
        if (!this.oscClient.isConnected()) {
            await this.connectOSC();
        }

        try {
            await this.oscClient.bootServer();
            vscode.window.showInformationMessage('Booting SuperCollider server...');
            this.updateStatusBar();
        } catch (err) {
            vscode.window.showErrorMessage(`Failed to boot server: ${err}`);
        }
    }

    async quitServer(): Promise<void> {
        if (!this.oscClient.isConnected()) {
            vscode.window.showWarningMessage('Not connected to sclang');
            return;
        }

        try {
            await this.oscClient.quitServer();
            vscode.window.showInformationMessage('Quitting SuperCollider server...');
            this.updateStatusBar();
        } catch (err) {
            vscode.window.showErrorMessage(`Failed to quit server: ${err}`);
        }
    }

    async evalSelection(): Promise<void> {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showWarningMessage('No active editor');
            return;
        }

        if (!this.oscClient.isConnected()) {
            await this.connectOSC();
        }

        try {
            const selection = editor.selection;
            let code: string;
            let rangeToFlash: vscode.Range;

            if (selection.isEmpty) {
                // If no selection, try to find enclosing parentheses block
                const blockRange = this.findEnclosingBlock(editor.document, selection.active);
                
                if (blockRange) {
                    // Found a parenthesized block
                    code = editor.document.getText(blockRange);
                    rangeToFlash = blockRange;
                } else {
                    // No block found, evaluate the current line
                    const line = editor.document.lineAt(selection.active.line);
                    code = line.text;
                    rangeToFlash = line.range;
                }
            } else {
                code = editor.document.getText(selection);
                rangeToFlash = new vscode.Range(selection.start, selection.end);
            }

            if (code.trim()) {
                await this.oscClient.sendEval(code);
                // Flash the selection briefly
                this.flashRange(editor, rangeToFlash);
            }
        } catch (err) {
            vscode.window.showErrorMessage(`Failed to evaluate code: ${err}`);
        }
    }

    private findEnclosingBlock(document: vscode.TextDocument, position: vscode.Position): vscode.Range | null {
        const text = document.getText();
        const offset = document.offsetAt(position);
        
        // Find the nearest opening parenthesis before cursor
        let openParen = -1;
        let depth = 0;
        
        for (let i = offset - 1; i >= 0; i--) {
            const char = text[i];
            if (char === ')') {
                depth++;
            } else if (char === '(') {
                if (depth === 0) {
                    openParen = i;
                    break;
                }
                depth--;
            }
        }
        
        if (openParen === -1) {
            return null; // No opening parenthesis found
        }
        
        // Find the matching closing parenthesis
        let closeParen = -1;
        depth = 0;
        
        for (let i = openParen + 1; i < text.length; i++) {
            const char = text[i];
            if (char === '(') {
                depth++;
            } else if (char === ')') {
                if (depth === 0) {
                    closeParen = i;
                    break;
                }
                depth--;
            }
        }
        
        if (closeParen === -1) {
            return null; // No matching closing parenthesis found
        }
        
        // Make sure cursor is within this block
        if (offset < openParen || offset > closeParen) {
            return null;
        }
        
        const startPos = document.positionAt(openParen);
        const endPos = document.positionAt(closeParen + 1);
        
        return new vscode.Range(startPos, endPos);
    }

    async evalFile(): Promise<void> {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showWarningMessage('No active editor');
            return;
        }

        if (!this.oscClient.isConnected()) {
            await this.connectOSC();
        }

        try {
            const code = editor.document.getText();
            if (code.trim()) {
                await this.oscClient.sendEval(code);
                vscode.window.showInformationMessage('Evaluating file...');
            }
        } catch (err) {
            vscode.window.showErrorMessage(`Failed to evaluate file: ${err}`);
        }
    }

    async stopSound(): Promise<void> {
        if (!this.oscClient.isConnected()) {
            await this.connectOSC();
        }

        try {
            await this.oscClient.stopAllSounds();
        } catch (err) {
            vscode.window.showErrorMessage(`Failed to stop sounds: ${err}`);
        }
    }

    async openHelp(): Promise<void> {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showWarningMessage('No active editor');
            return;
        }

        // Get word under cursor
        const position = editor.selection.active;
        const wordRange = editor.document.getWordRangeAtPosition(position);
        
        if (!wordRange) {
            vscode.window.showWarningMessage('No symbol under cursor');
            return;
        }

        const word = editor.document.getText(wordRange);
        
        if (!word.trim()) {
            vscode.window.showWarningMessage('No symbol under cursor');
            return;
        }

        await this.openHelpForSymbol(word);
    }

    private async openHelpForSymbol(symbol: string): Promise<void> {
        try {
            // Try to get help file path from sclang
            const config = vscode.workspace.getConfiguration('supercollider');
            const sclangPath = config.get<string>('sclangPath', 'sclang');

            // Create a temporary sclang script to find the help file
            const scCode = `
                var class, helpPath;
                class = "${symbol}".asSymbol.asClass;
                if (class.notNil) {
                    helpPath = class.help.path;
                    if (helpPath.notNil) {
                        helpPath.postln;
                    } {
                        "NOHELP".postln;
                    };
                } {
                    // Try to find help file directly
                    helpPath = Help.findHelpFile("${symbol}");
                    if (helpPath.notNil) {
                        helpPath.postln;
                    } {
                        "NOHELP".postln;
                    };
                };
                0.exit;
            `;

            // Execute sclang to get help path
            const result = await this.executeSclangCode(sclangPath, scCode);
            
            if (result.includes('NOHELP') || !result.trim()) {
                // Try opening in browser as fallback
                this.openHelpInBrowser(symbol);
                return;
            }

            const helpPath = result.trim().split('\n').pop()?.trim();
            
            if (helpPath && fs.existsSync(helpPath)) {
                // Open help file
                await this.openHelpFile(helpPath);
            } else {
                // Fallback to browser
                this.openHelpInBrowser(symbol);
            }
        } catch (err) {
            console.error('Error opening help:', err);
            // Fallback to browser
            this.openHelpInBrowser(symbol);
        }
    }

    private executeSclangCode(sclangPath: string, code: string): Promise<string> {
        return new Promise((resolve, reject) => {
            const proc = child_process.spawn(sclangPath, ['-e', code]);
            let output = '';
            let errorOutput = '';

            proc.stdout.on('data', (data) => {
                output += data.toString();
            });

            proc.stderr.on('data', (data) => {
                errorOutput += data.toString();
            });

            proc.on('close', (code) => {
                if (code === 0 || output.length > 0) {
                    resolve(output);
                } else {
                    reject(new Error(errorOutput || 'sclang failed'));
                }
            });

            proc.on('error', (err) => {
                reject(err);
            });

            // Timeout after 5 seconds
            setTimeout(() => {
                proc.kill();
                reject(new Error('sclang timeout'));
            }, 5000);
        });
    }

    private async openHelpFile(helpPath: string): Promise<void> {
        const ext = path.extname(helpPath).toLowerCase();
        
        if (ext === '.html' || ext === '.htm') {
            // Open HTML in browser
            const uri = vscode.Uri.file(helpPath);
            await vscode.env.openExternal(uri);
            vscode.window.showInformationMessage(`Opening help for ${path.basename(helpPath, ext)}`);
        } else if (ext === '.scd' || ext === '.sc') {
            // Open SC file in editor
            const document = await vscode.workspace.openTextDocument(helpPath);
            await vscode.window.showTextDocument(document, {
                preview: true,
                viewColumn: vscode.ViewColumn.Beside
            });
        } else {
            // Try to open as text
            const document = await vscode.workspace.openTextDocument(helpPath);
            await vscode.window.showTextDocument(document, {
                preview: true,
                viewColumn: vscode.ViewColumn.Beside
            });
        }
    }

    private openHelpInBrowser(symbol: string): void {
        // Fallback: Open SuperCollider documentation website
        const docUrl = `https://doc.sccode.org/Classes/${symbol}.html`;
        vscode.env.openExternal(vscode.Uri.parse(docUrl));
        vscode.window.showInformationMessage(
            `Opening online help for "${symbol}". ` +
            'For local help, ensure SuperCollider is properly installed.'
        );
    }

    private flashRange(editor: vscode.TextEditor, range: vscode.Range): void {
        const decorationType = vscode.window.createTextEditorDecorationType({
            backgroundColor: 'rgba(255, 255, 0, 0.3)'
        });

        editor.setDecorations(decorationType, [range]);

        setTimeout(() => {
            decorationType.dispose();
        }, 200);
    }

    private flashSelection(editor: vscode.TextEditor, selection: vscode.Selection): void {
        const range = selection.isEmpty 
            ? editor.document.lineAt(selection.active.line).range 
            : selection;
        this.flashRange(editor, range);
    }

    private updateStatusBar(): void {
        const connected = this.oscClient.isConnected();
        const lspRunning = this.languageClient.isRunning();

        let text = 'SC';
        let tooltip = 'SuperCollider';

        if (connected) {
            text += ' ●';
            tooltip += ' (Connected)';
        } else {
            text += ' ○';
            tooltip += ' (Disconnected)';
        }

        if (lspRunning) {
            tooltip += ' | LSP Active';
        }

        this.statusBarItem.text = text;
        this.statusBarItem.tooltip = tooltip;
        this.statusBarItem.show();
    }
}

