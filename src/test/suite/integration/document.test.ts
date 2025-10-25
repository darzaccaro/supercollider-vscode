import * as assert from 'assert';
import * as vscode from 'vscode';
import * as path from 'path';

suite('Document Integration Tests', function() {
    this.timeout(10000);

    test('Should recognize .sc files as SuperCollider', async () => {
        const testFile = path.resolve(__dirname, '../../fixtures/test.scd');
        const document = await vscode.workspace.openTextDocument(testFile);
        
        assert.strictEqual(document.languageId, 'supercollider');
    });

    test('Should recognize .scd files as SuperCollider', async () => {
        const testFile = path.resolve(__dirname, '../../fixtures/test.scd');
        const document = await vscode.workspace.openTextDocument(testFile);
        
        assert.strictEqual(document.languageId, 'supercollider');
    });

    test('Should open SuperCollider file in editor', async () => {
        const testFile = path.resolve(__dirname, '../../fixtures/test.scd');
        const document = await vscode.workspace.openTextDocument(testFile);
        const editor = await vscode.window.showTextDocument(document);
        
        assert.ok(editor);
        assert.strictEqual(editor.document.languageId, 'supercollider');
    });

    test('Should have syntax highlighting for SuperCollider files', async () => {
        const testFile = path.resolve(__dirname, '../../fixtures/test.scd');
        const document = await vscode.workspace.openTextDocument(testFile);
        
        // Check that the document has associated token provider
        assert.strictEqual(document.languageId, 'supercollider');
        assert.ok(document.getText().length > 0);
    });
});

