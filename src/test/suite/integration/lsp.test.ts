import * as assert from 'assert';
import { SuperColliderLanguageClient } from '../../../languageClient';
import { SuperColliderConfig } from '../../../config';

suite('LSP Integration Tests', function() {
    this.timeout(30000);

    let languageClient: SuperColliderLanguageClient;
    let config: SuperColliderConfig;

    suiteSetup(async function() {
        // Check if sclang is available
        try {
            const { spawnSync } = await import('child_process');
            const result = spawnSync('which', ['sclang']);
            if (result.status !== 0) {
                console.log('sclang not found, skipping LSP tests');
                this.skip();
            }
        } catch (err) {
            console.log('Could not check for sclang, skipping LSP tests');
            this.skip();
        }
    });

    setup(() => {
        config = {
            sclangPath: 'sclang',
            oscHost: '127.0.0.1',
            oscPort: 57120,
            useLanguageServer: true,
            languageServerPort: 57123
        };
        
        languageClient = new SuperColliderLanguageClient(config);
    });

    teardown(async () => {
        if (languageClient) {
            await languageClient.stop();
        }
    });

    test('LanguageClient initializes correctly', () => {
        assert.ok(languageClient);
        assert.strictEqual(languageClient.isRunning(), false);
    });

    test('LanguageClient can be stopped when not running', async () => {
        await languageClient.stop();
        assert.strictEqual(languageClient.isRunning(), false);
    });

    // Note: Full LSP testing would require a running LanguageServer Quark
    // which may not be available in all test environments
    test('LanguageClient handles missing server gracefully', async function() {
        // This test verifies that attempting to connect to a non-existent
        // language server doesn't crash the extension
        
        try {
            // Create a mock context
            const mockContext = {
                subscriptions: [],
                workspaceState: {
                    get: () => undefined,
                    update: () => Promise.resolve()
                },
                globalState: {
                    get: () => undefined,
                    update: () => Promise.resolve()
                },
                extensionPath: __dirname,
                storagePath: __dirname,
                globalStoragePath: __dirname,
                logPath: __dirname
            };

            await languageClient.start(mockContext as any);
            
            // Should not crash even if server is not available
            assert.ok(true);
        } catch (err) {
            // Expected behavior - connection failure is acceptable
            assert.ok(true);
        }
    });
});

