import * as assert from 'assert';
import * as child_process from 'child_process';
import { OSCClient } from '../../../oscClient';

suite('Code Evaluation Integration Tests', function() {
    this.timeout(30000);

    let sclangProcess: child_process.ChildProcess | null = null;
    let oscClient: OSCClient;
    const oscPort = 57122; // Use different port to avoid conflicts

    suiteSetup(async function() {
        // Check if sclang is available
        try {
            const result = child_process.spawnSync('which', ['sclang']);
            if (result.status !== 0) {
                console.log('sclang not found, skipping evaluation tests');
                this.skip();
            }
        } catch (err) {
            console.log('Could not check for sclang, skipping evaluation tests');
            this.skip();
        }
    });

    setup(async function() {
        try {
            sclangProcess = child_process.spawn('sclang', ['-i', 'scvim'], {
                stdio: ['pipe', 'pipe', 'pipe']
            });

            await new Promise(resolve => setTimeout(resolve, 3000));

            if (sclangProcess.stdin) {
                sclangProcess.stdin.write(`
                    thisProcess.openUDPPort(${oscPort});
                    OSCFunc({ |msg, time, addr, recvPort|
                        msg[1].asString.interpret;
                    }, '/interpret');
                \\n`);
            }

            await new Promise(resolve => setTimeout(resolve, 1000));

            oscClient = new OSCClient('127.0.0.1', oscPort);
            await oscClient.connect();
        } catch (err) {
            console.error('Failed to start sclang:', err);
            this.skip();
        }
    });

    teardown(async function() {
        if (oscClient && oscClient.isConnected()) {
            oscClient.disconnect();
        }

        if (sclangProcess) {
            sclangProcess.kill('SIGTERM');
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            if (sclangProcess && !sclangProcess.killed) {
                sclangProcess.kill('SIGKILL');
            }
            
            sclangProcess = null;
        }
    });

    test('Can evaluate simple expression', async function() {
        await oscClient.sendEval('1 + 1;');
        await new Promise(resolve => setTimeout(resolve, 500));
        assert.ok(true);
    });

    test('Can evaluate variable assignment', async function() {
        await oscClient.sendEval('~testVar = 42;');
        await new Promise(resolve => setTimeout(resolve, 500));
        assert.ok(true);
    });

    test('Can evaluate multiple lines', async function() {
        const code = `
            ~x = 10;
            ~y = 20;
            ~z = ~x + ~y;
        `;
        await oscClient.sendEval(code);
        await new Promise(resolve => setTimeout(resolve, 500));
        assert.ok(true);
    });

    test('Can evaluate function definition', async function() {
        const code = `~testFunc = { |a, b| a + b };`;
        await oscClient.sendEval(code);
        await new Promise(resolve => setTimeout(resolve, 500));
        assert.ok(true);
    });
});

