import * as vscode from 'vscode';
import { getConfig, validateConfig } from './config';
import { OSCClient } from './oscClient';
import { SuperColliderLanguageClient } from './languageClient';
import { SuperColliderCommands } from './commands';

let oscClient: OSCClient;
let languageClient: SuperColliderLanguageClient;
let commands: SuperColliderCommands;
let statusBarItem: vscode.StatusBarItem;

export async function activate(context: vscode.ExtensionContext) {
    console.log('SuperCollider extension is now active');

    // Load configuration
    const config = getConfig();
    const configErrors = validateConfig(config);
    
    if (configErrors.length > 0) {
        vscode.window.showErrorMessage(
            `SuperCollider configuration errors: ${configErrors.join(', ')}`
        );
        return;
    }

    // Initialize components
    oscClient = new OSCClient(config.oscHost, config.oscPort);
    languageClient = new SuperColliderLanguageClient(config);
    
    // Create status bar item
    statusBarItem = vscode.window.createStatusBarItem(
        vscode.StatusBarAlignment.Right,
        100
    );
    statusBarItem.command = 'supercollider.connectOSC';
    statusBarItem.text = 'SC ○';
    statusBarItem.tooltip = 'SuperCollider (Click to connect)';
    statusBarItem.show();
    context.subscriptions.push(statusBarItem);

    // Initialize commands
    commands = new SuperColliderCommands(oscClient, languageClient, statusBarItem);

    // Register commands
    context.subscriptions.push(
        vscode.commands.registerCommand('supercollider.connectOSC', () => {
            return commands.connectOSC();
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('supercollider.startLanguageServer', () => {
            return commands.startLanguageServer(context);
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('supercollider.bootServer', () => {
            return commands.bootServer();
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('supercollider.quitServer', () => {
            return commands.quitServer();
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('supercollider.evalSelection', () => {
            return commands.evalSelection();
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('supercollider.evalFile', () => {
            return commands.evalFile();
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('supercollider.stopSound', () => {
            return commands.stopSound();
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('supercollider.openHelp', () => {
            return commands.openHelp();
        })
    );

    // Listen for configuration changes
    context.subscriptions.push(
        vscode.workspace.onDidChangeConfiguration(e => {
            if (e.affectsConfiguration('supercollider')) {
                const newConfig = getConfig();
                oscClient.updateConnection(newConfig.oscHost, newConfig.oscPort);
                
                vscode.window.showInformationMessage(
                    'SuperCollider configuration updated. Reconnect to apply changes.'
                );
            }
        })
    );

    // Auto-connect to existing scide instance via OSC
    try {
        await oscClient.connect();
        statusBarItem.text = 'SC ●';
        statusBarItem.tooltip = 'SuperCollider (Connected)';
        console.log('Auto-connected to SuperCollider via OSC');
    } catch (err) {
        console.log('SuperCollider not running yet (will connect on first evaluation)');
        statusBarItem.text = 'SC ○';
        statusBarItem.tooltip = 'SuperCollider (Not connected - start scide first)';
    }

    // Auto-start language server if enabled (optional feature)
    // Disabled by default as it requires LanguageServer Quark
    if (config.useLanguageServer) {
        // Try to start LSP but don't block or show errors if it fails
        languageClient.start(context).catch(() => {
            // Silently fail - LSP is optional
        });
    }
}

export async function deactivate() {
    if (oscClient) {
        oscClient.disconnect();
    }
    
    if (languageClient) {
        // Send quit command to sclang before stopping
        const sclangProcess = languageClient.getSclangProcess();
        if (sclangProcess) {
            languageClient.sendToSclang('0.exit;');
            await new Promise(resolve => setTimeout(resolve, 500));
        }
        await languageClient.stop();
    }
}

