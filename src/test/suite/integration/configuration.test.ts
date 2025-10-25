import * as assert from 'assert';
import * as vscode from 'vscode';

suite('Configuration Integration Tests', function() {
    this.timeout(10000);

    let originalConfig: any;

    setup(() => {
        // Save original configuration
        const config = vscode.workspace.getConfiguration('supercollider');
        originalConfig = {
            sclangPath: config.get('sclangPath'),
            oscHost: config.get('oscHost'),
            oscPort: config.get('oscPort'),
            useLanguageServer: config.get('useLanguageServer'),
            languageServerPort: config.get('languageServerPort')
        };
    });

    teardown(async () => {
        // Restore original configuration
        const config = vscode.workspace.getConfiguration('supercollider');
        await config.update('sclangPath', originalConfig.sclangPath, vscode.ConfigurationTarget.Global);
        await config.update('oscHost', originalConfig.oscHost, vscode.ConfigurationTarget.Global);
        await config.update('oscPort', originalConfig.oscPort, vscode.ConfigurationTarget.Global);
        await config.update('useLanguageServer', originalConfig.useLanguageServer, vscode.ConfigurationTarget.Global);
        await config.update('languageServerPort', originalConfig.languageServerPort, vscode.ConfigurationTarget.Global);
    });

    test('Should be able to update sclangPath', async () => {
        const config = vscode.workspace.getConfiguration('supercollider');
        await config.update('sclangPath', '/custom/path/sclang', vscode.ConfigurationTarget.Global);
        
        const updatedConfig = vscode.workspace.getConfiguration('supercollider');
        assert.strictEqual(updatedConfig.get('sclangPath'), '/custom/path/sclang');
    });

    test('Should be able to update oscHost', async () => {
        const config = vscode.workspace.getConfiguration('supercollider');
        await config.update('oscHost', '192.168.1.1', vscode.ConfigurationTarget.Global);
        
        const updatedConfig = vscode.workspace.getConfiguration('supercollider');
        assert.strictEqual(updatedConfig.get('oscHost'), '192.168.1.1');
    });

    test('Should be able to update oscPort', async () => {
        const config = vscode.workspace.getConfiguration('supercollider');
        await config.update('oscPort', 9000, vscode.ConfigurationTarget.Global);
        
        const updatedConfig = vscode.workspace.getConfiguration('supercollider');
        assert.strictEqual(updatedConfig.get('oscPort'), 9000);
    });

    test('Should be able to toggle useLanguageServer', async () => {
        const config = vscode.workspace.getConfiguration('supercollider');
        const current = config.get('useLanguageServer');
        
        await config.update('useLanguageServer', !current, vscode.ConfigurationTarget.Global);
        
        const updatedConfig = vscode.workspace.getConfiguration('supercollider');
        assert.strictEqual(updatedConfig.get('useLanguageServer'), !current);
    });

    test('Should be able to update languageServerPort', async () => {
        const config = vscode.workspace.getConfiguration('supercollider');
        await config.update('languageServerPort', 8888, vscode.ConfigurationTarget.Global);
        
        const updatedConfig = vscode.workspace.getConfiguration('supercollider');
        assert.strictEqual(updatedConfig.get('languageServerPort'), 8888);
    });

    test('Configuration changes should trigger update handlers', async () => {
        const config = vscode.workspace.getConfiguration('supercollider');
        const currentPort = config.get('oscPort') as number;
        
        // Change configuration
        await config.update('oscPort', currentPort + 1, vscode.ConfigurationTarget.Global);
        
        // Give time for handlers to execute
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const updatedConfig = vscode.workspace.getConfiguration('supercollider');
        assert.strictEqual(updatedConfig.get('oscPort'), currentPort + 1);
    });
});

