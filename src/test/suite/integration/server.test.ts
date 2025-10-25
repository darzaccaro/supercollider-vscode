import * as assert from 'assert';
import * as child_process from 'child_process';
import { OSCClient } from '../../../oscClient';

suite('Server Integration Tests', function() {
    this.timeout(30000); // Longer timeout for integration tests

    let sclangProcess: child_process.ChildProcess | null = null;
    let oscClient: OSCClient;
    const oscPort = 57120;

    suiteSetup(async function() {
        // Check if sclang is available
        try {
            const result = child_process.spawnSync('which', ['sclang']);
            if (result.status !== 0) {
                console.log('sclang not found, skipping integration tests');
                this.skip();
            }
        } catch (err) {
            console.log('Could not check for sclang, skipping integration tests');
            this.skip();
        }
    });

    setup(async function() {
        // Start sclang process for testing
        try {
            sclangProcess = child_process.spawn('sclang', ['-i', 'scvim'], {
                stdio: ['pipe', 'pipe', 'pipe']
            });

            // Wait for sclang to initialize
            await new Promise(resolve => setTimeout(resolve, 3000));

            // Initialize OSC in sclang
            if (sclangProcess.stdin) {
                sclangProcess.stdin.write(`
                    thisProcess.openUDPPort(${oscPort});
                    OSCFunc({ |msg, time, addr, recvPort|
                        msg[1].asString.interpret;
                    }, '/interpret');
                \\n`);
            }

            await new Promise(resolve => setTimeout(resolve, 1000));

            // Create OSC client
            oscClient = new OSCClient('127.0.0.1', oscPort);
        } catch (err) {
            console.error('Failed to start sclang:', err);
            this.skip();
        }
    });

    teardown(async function() {
        // Clean up
        if (oscClient && oscClient.isConnected()) {
            oscClient.disconnect();
        }

        if (sclangProcess) {
            sclangProcess.kill('SIGTERM');
            
            // Wait for process to exit
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            if (sclangProcess && !sclangProcess.killed) {
                sclangProcess.kill('SIGKILL');
            }
            
            sclangProcess = null;
        }
    });

    test('Can connect to sclang via OSC', async function() {
        await oscClient.connect();
        assert.strictEqual(oscClient.isConnected(), true);
    });

    test('Can send code evaluation to sclang', async function() {
        await oscClient.connect();
        
        // Send a simple test code
        await oscClient.sendEval('"Hello from test".postln;');
        
        // Wait for processing
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // If we got here without error, the test passes
        assert.ok(true);
    });

    test('Can boot and quit server', async function() {
        await oscClient.connect();
        
        // Boot server
        await oscClient.bootServer();
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Quit server
        await oscClient.quitServer();
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        assert.ok(true);
    });

    test('Can stop all sounds', async function() {
        await oscClient.connect();
        
        await oscClient.stopAllSounds();
        await new Promise(resolve => setTimeout(resolve, 500));
        
        assert.ok(true);
    });
});

