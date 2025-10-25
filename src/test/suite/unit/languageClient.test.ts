import * as assert from 'assert';
import * as sinon from 'sinon';
import { SuperColliderLanguageClient } from '../../../languageClient';
import { SuperColliderConfig } from '../../../config';

suite('LanguageClient Unit Tests', () => {
    let languageClient: SuperColliderLanguageClient;
    let config: SuperColliderConfig;

    setup(() => {
        config = {
            sclangPath: 'sclang',
            oscHost: '127.0.0.1',
            oscPort: 57120,
            useLanguageServer: true,
            languageServerPort: 57121
        };
        languageClient = new SuperColliderLanguageClient(config);
    });

    teardown(() => {
        sinon.restore();
    });

    test('should initialize with correct config', () => {
        assert.ok(languageClient);
        assert.strictEqual(languageClient.isRunning(), false);
    });

    test('should not start when useLanguageServer is false', async () => {
        config.useLanguageServer = false;
        languageClient = new SuperColliderLanguageClient(config);

        await languageClient.start({} as any);

        assert.strictEqual(languageClient.isRunning(), false);
    });

    test('isRunning should return false initially', () => {
        assert.strictEqual(languageClient.isRunning(), false);
    });

    test('stop should handle null client gracefully', async () => {
        await assert.doesNotReject(async () => {
            await languageClient.stop();
        });
    });
});

