import * as assert from 'assert';
import * as vscode from 'vscode';

suite('Extension Integration Tests', function() {
    this.timeout(10000);

    test('Extension should be present', () => {
        const extension = vscode.extensions.getExtension('supercollider.supercollider-vscode');
        assert.ok(extension);
    });

    test('Extension should activate', async () => {
        const extension = vscode.extensions.getExtension('supercollider.supercollider-vscode');
        if (!extension) {
            assert.fail('Extension not found');
        }

        await extension.activate();
        assert.strictEqual(extension.isActive, true);
    });

    test('All commands should be registered', async () => {
        const commands = await vscode.commands.getCommands(true);
        
        const expectedCommands = [
            'supercollider.connectOSC',
            'supercollider.startLanguageServer',
            'supercollider.bootServer',
            'supercollider.quitServer',
            'supercollider.evalSelection',
            'supercollider.evalFile',
            'supercollider.stopSound'
        ];

        for (const cmd of expectedCommands) {
            assert.ok(
                commands.includes(cmd),
                `Command ${cmd} should be registered`
            );
        }
    });

    test('Configuration should be available', () => {
        const config = vscode.workspace.getConfiguration('supercollider');
        
        assert.ok(config.has('sclangPath'));
        assert.ok(config.has('oscHost'));
        assert.ok(config.has('oscPort'));
        assert.ok(config.has('useLanguageServer'));
        assert.ok(config.has('languageServerPort'));
    });

    test('Default configuration values should be correct', () => {
        const config = vscode.workspace.getConfiguration('supercollider');
        
        assert.strictEqual(config.get('sclangPath'), 'sclang');
        assert.strictEqual(config.get('oscHost'), '127.0.0.1');
        assert.strictEqual(config.get('oscPort'), 57120);
        assert.strictEqual(config.get('useLanguageServer'), true);
        assert.strictEqual(config.get('languageServerPort'), 57121);
    });
});

