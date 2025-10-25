import * as assert from 'assert';
import * as vscode from 'vscode';

suite('Status Bar Integration Tests', function() {
    this.timeout(10000);

    suiteSetup(async () => {
        // Ensure extension is activated
        const extension = vscode.extensions.getExtension('supercollider.supercollider-vscode');
        if (extension && !extension.isActive) {
            await extension.activate();
        }
    });

    test('Status bar item should exist after activation', async () => {
        // Give extension time to initialize
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // We can't directly access the status bar item, but we can verify
        // that the extension is active
        const extension = vscode.extensions.getExtension('supercollider.supercollider-vscode');
        assert.ok(extension);
        assert.strictEqual(extension?.isActive, true);
    });
});

