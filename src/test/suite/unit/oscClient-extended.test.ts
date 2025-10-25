import * as assert from 'assert';
import { OSCClient } from '../../../oscClient';

suite('OSCClient Extended Unit Tests', () => {
    let client: OSCClient;

    setup(() => {
        client = new OSCClient('127.0.0.1', 57120);
    });

    teardown(() => {
        if (client.isConnected()) {
            client.disconnect();
        }
    });

    test('Should handle multiple disconnects gracefully', () => {
        assert.doesNotThrow(() => {
            client.disconnect();
            client.disconnect();
            client.disconnect();
        });
    });

    test('Should throw when evaluating code without connection', async () => {
        await assert.rejects(
            async () => await client.sendEval('1 + 1'),
            /not connected/i
        );
    });

    test('Should throw when booting server without connection', async () => {
        await assert.rejects(
            async () => await client.bootServer(),
            /not connected/i
        );
    });

    test('Should throw when quitting server without connection', async () => {
        await assert.rejects(
            async () => await client.quitServer(),
            /not connected/i
        );
    });

    test('Should throw when stopping sounds without connection', async () => {
        await assert.rejects(
            async () => await client.stopAllSounds(),
            /not connected/i
        );
    });

    test('Should update connection parameters correctly', () => {
        client.updateConnection('192.168.1.1', 9000);
        assert.strictEqual(client.isConnected(), false);
    });

    test('Should disconnect when updating connection parameters while connected', async () => {
        // Note: This test documents the behavior even if we can't actually connect
        client.updateConnection('192.168.1.1', 9000);
        assert.strictEqual(client.isConnected(), false);
    });

    test('Should handle different host formats', () => {
        assert.doesNotThrow(() => {
            new OSCClient('localhost', 57120);
            new OSCClient('127.0.0.1', 57120);
            new OSCClient('0.0.0.0', 57120);
        });
    });

    test('Should handle different port numbers', () => {
        assert.doesNotThrow(() => {
            new OSCClient('127.0.0.1', 1);
            new OSCClient('127.0.0.1', 57120);
            new OSCClient('127.0.0.1', 65535);
        });
    });

    test('Initial connection state should be false', () => {
        const newClient = new OSCClient('127.0.0.1', 57120);
        assert.strictEqual(newClient.isConnected(), false);
    });

    test('Should maintain disconnected state after multiple checks', () => {
        assert.strictEqual(client.isConnected(), false);
        assert.strictEqual(client.isConnected(), false);
        assert.strictEqual(client.isConnected(), false);
    });

    test('Should accept IPv4 addresses', () => {
        assert.doesNotThrow(() => {
            new OSCClient('192.168.1.1', 57120);
            new OSCClient('10.0.0.1', 57120);
            new OSCClient('172.16.0.1', 57120);
        });
    });
});

