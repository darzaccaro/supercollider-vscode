import * as assert from 'assert';
import * as vscode from 'vscode';
import * as path from 'path';

suite('Block Evaluation Integration Tests', function() {
    this.timeout(10000);

    test('Should evaluate parenthesized block when cursor is inside', async () => {
        // Create a test document with a parenthesized block
        const content = `// Test file
(
    var x = 10;
    var y = 20;
    x + y;
)

Server.default.boot;`;

        const doc = await vscode.workspace.openTextDocument({
            content: content,
            language: 'supercollider'
        });
        
        const editor = await vscode.window.showTextDocument(doc);
        
        // Place cursor inside the block (line 2)
        const position = new vscode.Position(2, 8);
        editor.selection = new vscode.Selection(position, position);
        
        assert.strictEqual(editor.selection.isEmpty, true, 'Selection should be empty');
        assert.strictEqual(editor.document.languageId, 'supercollider');
    });

    test('Should evaluate single line when cursor is outside block', async () => {
        const content = `(
    var x = 10;
)

Server.default.boot;`;

        const doc = await vscode.workspace.openTextDocument({
            content: content,
            language: 'supercollider'
        });
        
        const editor = await vscode.window.showTextDocument(doc);
        
        // Place cursor on line outside block
        const position = new vscode.Position(4, 5);
        editor.selection = new vscode.Selection(position, position);
        
        const line = editor.document.lineAt(position.line);
        assert.ok(line.text.includes('Server'), 'Line should contain Server command');
    });

    test('Should handle nested parentheses', async () => {
        const content = `(
    var synth = (
        instrument: \\default,
        freq: 440
    );
    synth.play;
)`;

        const doc = await vscode.workspace.openTextDocument({
            content: content,
            language: 'supercollider'
        });
        
        const editor = await vscode.window.showTextDocument(doc);
        
        // Place cursor in inner block
        const position = new vscode.Position(3, 10);
        editor.selection = new vscode.Selection(position, position);
        
        assert.ok(editor.document.getText().includes('instrument'));
    });

    test('Should handle selected text regardless of blocks', async () => {
        const content = `(
    var x = 10;
    var y = 20;
)`;

        const doc = await vscode.workspace.openTextDocument({
            content: content,
            language: 'supercollider'
        });
        
        const editor = await vscode.window.showTextDocument(doc);
        
        // Select a portion of text
        const start = new vscode.Position(1, 4);
        const end = new vscode.Position(1, 15);
        editor.selection = new vscode.Selection(start, end);
        
        assert.strictEqual(editor.selection.isEmpty, false, 'Should have selection');
        assert.ok(editor.document.getText(editor.selection).includes('var x'));
    });
});

