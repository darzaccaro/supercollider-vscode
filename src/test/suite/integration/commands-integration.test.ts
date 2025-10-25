import * as assert from 'assert';
import * as vscode from 'vscode';
import * as path from 'path';

suite('Commands Integration Tests', function() {
    this.timeout(15000);

    suiteSetup(async () => {
        const extension = vscode.extensions.getExtension('supercollider.supercollider-vscode');
        if (extension && !extension.isActive) {
            await extension.activate();
        }
        await new Promise(resolve => setTimeout(resolve, 1000));
    });

    test('evalSelection command should be available', async () => {
        const commands = await vscode.commands.getCommands(true);
        assert.ok(commands.includes('supercollider.evalSelection'));
    });

    test('evalFile command should be available', async () => {
        const commands = await vscode.commands.getCommands(true);
        assert.ok(commands.includes('supercollider.evalFile'));
    });

    test('evalSelection should handle empty editor gracefully', async () => {
        // Close all editors
        await vscode.commands.executeCommand('workbench.action.closeAllEditors');
        
        // This should not throw, but may show a warning
        await assert.doesNotReject(async () => {
            await vscode.commands.executeCommand('supercollider.evalSelection');
        });
    });

    test('evalFile should handle empty editor gracefully', async () => {
        await vscode.commands.executeCommand('workbench.action.closeAllEditors');
        
        await assert.doesNotReject(async () => {
            await vscode.commands.executeCommand('supercollider.evalFile');
        });
    });

    test('connectOSC command should be executable', async () => {
        // Should not throw, even if connection fails
        await assert.doesNotReject(async () => {
            await vscode.commands.executeCommand('supercollider.connectOSC');
        });
    });

    test('bootServer command should be executable', async () => {
        await assert.doesNotReject(async () => {
            await vscode.commands.executeCommand('supercollider.bootServer');
        });
    });

    test('quitServer command should be executable', async () => {
        await assert.doesNotReject(async () => {
            await vscode.commands.executeCommand('supercollider.quitServer');
        });
    });

    test('stopSound command should be executable', async () => {
        await assert.doesNotReject(async () => {
            await vscode.commands.executeCommand('supercollider.stopSound');
        });
    });

    test('startLanguageServer command should be executable', async () => {
        await assert.doesNotReject(async () => {
            await vscode.commands.executeCommand('supercollider.startLanguageServer');
        });
    });

    test('evalSelection with SuperCollider file', async () => {
        const testFile = path.resolve(__dirname, '../../fixtures/test.scd');
        const document = await vscode.workspace.openTextDocument(testFile);
        const editor = await vscode.window.showTextDocument(document);

        // Select some text
        editor.selection = new vscode.Selection(0, 0, 0, 10);

        // Should execute without throwing
        await assert.doesNotReject(async () => {
            await vscode.commands.executeCommand('supercollider.evalSelection');
        });
    });

    test('evalFile with SuperCollider file', async () => {
        const testFile = path.resolve(__dirname, '../../fixtures/test.scd');
        const document = await vscode.workspace.openTextDocument(testFile);
        await vscode.window.showTextDocument(document);

        await assert.doesNotReject(async () => {
            await vscode.commands.executeCommand('supercollider.evalFile');
        });
    });
});

