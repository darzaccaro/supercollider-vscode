import * as path from 'path';
import { runTests } from '@vscode/test-electron';

async function main() {
    try {
        // The folder containing the Extension Manifest package.json
        const extensionDevelopmentPath = path.resolve(__dirname, '../../');

        // The path to the extension test script
        const extensionTestsPath = path.resolve(__dirname, './suite/index');

        // Run the integration test
        // Note: Some tests may require SuperCollider to be installed
        await runTests({
            extensionDevelopmentPath,
            extensionTestsPath,
            version: 'stable'
        });
    } catch (err) {
        console.error('Failed to run tests:', err);
        console.error('Note: This may be due to VS Code test harness limitations on your platform.');
        console.error('Try running the extension in debug mode (F5) to test manually.');
        process.exit(1);
    }
}

main();

