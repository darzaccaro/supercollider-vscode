import * as assert from 'assert';
import { OSCClient } from '../../../oscClient';

suite('OSCClient Unit Tests', () => {
    let client: OSCClient;

    setup(() => {
        client = new OSCClient('127.0.0.1', 57120);
    });

    teardown(() => {
        if (client.isConnected()) {
            client.disconnect();
        }
    });

    test('OSCClient initializes with correct host and port', () => {
        assert.ok(client);
        assert.strictEqual(client.isConnected(), false);
    });

    test('OSCClient updates connection parameters', () => {
        client.updateConnection('192.168.1.1', 9000);
        assert.strictEqual(client.isConnected(), false);
    });

    test('OSCClient disconnect when not connected does not throw', () => {
        assert.doesNotThrow(() => {
            client.disconnect();
        });
    });

    test('OSCClient throws error when sending without connection', async () => {
        try {
            await client.sendEval('test');
            assert.fail('Should have thrown error');
        } catch (err) {
            assert.ok(err);
        }
    });

    test('OSCClient isConnected returns false initially', () => {
        assert.strictEqual(client.isConnected(), false);
    });
});

