import * as assert from 'assert';
import * as vscode from 'vscode';
import * as sinon from 'sinon';
import { SuperColliderCommands } from '../../../commands';
import { OSCClient } from '../../../oscClient';
import { SuperColliderLanguageClient } from '../../../languageClient';

suite('Commands Unit Tests', () => {
    let commands: SuperColliderCommands;
    let mockOSCClient: sinon.SinonStubbedInstance<OSCClient>;
    let mockLanguageClient: sinon.SinonStubbedInstance<SuperColliderLanguageClient>;
    let mockStatusBar: vscode.StatusBarItem;
    let showInformationMessageStub: sinon.SinonStub;
    let showErrorMessageStub: sinon.SinonStub;
    let showWarningMessageStub: sinon.SinonStub;

    setup(() => {
        // Create mocks
        mockOSCClient = sinon.createStubInstance(OSCClient);
        mockLanguageClient = sinon.createStubInstance(SuperColliderLanguageClient);
        mockStatusBar = {
            text: '',
            tooltip: '',
            command: undefined,
            alignment: vscode.StatusBarAlignment.Right,
            priority: 100,
            show: sinon.stub(),
            hide: sinon.stub(),
            dispose: sinon.stub(),
            name: 'SuperCollider',
            id: 'supercollider-status',
            backgroundColor: undefined,
            color: undefined,
            accessibilityInformation: undefined
        };

        // Stub window methods
        showInformationMessageStub = sinon.stub(vscode.window, 'showInformationMessage');
        showErrorMessageStub = sinon.stub(vscode.window, 'showErrorMessage');
        showWarningMessageStub = sinon.stub(vscode.window, 'showWarningMessage');

        commands = new SuperColliderCommands(
            mockOSCClient as any,
            mockLanguageClient as any,
            mockStatusBar
        );
    });

    teardown(() => {
        sinon.restore();
    });

    suite('connectOSC', () => {
        test('should connect when not already connected', async () => {
            mockOSCClient.isConnected.returns(false);
            mockOSCClient.connect.resolves();

            await commands.connectOSC();

            assert.ok(mockOSCClient.connect.calledOnce);
            assert.ok(showInformationMessageStub.calledWith('Connected to sclang via OSC'));
        });

        test('should show message when already connected', async () => {
            mockOSCClient.isConnected.returns(true);

            await commands.connectOSC();

            assert.ok(mockOSCClient.connect.notCalled);
            assert.ok(showInformationMessageStub.calledWith('Already connected to sclang'));
        });

        test('should handle connection errors', async () => {
            mockOSCClient.isConnected.returns(false);
            mockOSCClient.connect.rejects(new Error('Connection failed'));

            await commands.connectOSC();

            assert.ok(showErrorMessageStub.called);
            const errorMessage = showErrorMessageStub.firstCall.args[0];
            assert.ok(errorMessage.includes('Failed to connect to sclang'));
        });
    });

    suite('bootServer', () => {
        test('should boot server when connected', async () => {
            mockOSCClient.isConnected.returns(true);
            mockOSCClient.bootServer.resolves();

            await commands.bootServer();

            assert.ok(mockOSCClient.bootServer.calledOnce);
            assert.ok(showInformationMessageStub.calledWith('Booting SuperCollider server...'));
        });

        test('should connect first if not connected', async () => {
            mockOSCClient.isConnected.onFirstCall().returns(false);
            mockOSCClient.isConnected.onSecondCall().returns(true);
            mockOSCClient.connect.resolves();
            mockOSCClient.bootServer.resolves();

            await commands.bootServer();

            assert.ok(mockOSCClient.connect.calledOnce);
            assert.ok(mockOSCClient.bootServer.calledOnce);
        });

        test('should handle boot errors', async () => {
            mockOSCClient.isConnected.returns(true);
            mockOSCClient.bootServer.rejects(new Error('Boot failed'));

            await commands.bootServer();

            assert.ok(showErrorMessageStub.called);
            const errorMessage = showErrorMessageStub.firstCall.args[0];
            assert.ok(errorMessage.includes('Failed to boot server'));
        });
    });

    suite('quitServer', () => {
        test('should quit server when connected', async () => {
            mockOSCClient.isConnected.returns(true);
            mockOSCClient.quitServer.resolves();

            await commands.quitServer();

            assert.ok(mockOSCClient.quitServer.calledOnce);
            assert.ok(showInformationMessageStub.calledWith('Quitting SuperCollider server...'));
        });

        test('should show warning when not connected', async () => {
            mockOSCClient.isConnected.returns(false);

            await commands.quitServer();

            assert.ok(mockOSCClient.quitServer.notCalled);
            assert.ok(showWarningMessageStub.calledWith('Not connected to sclang'));
        });

        test('should handle quit errors', async () => {
            mockOSCClient.isConnected.returns(true);
            mockOSCClient.quitServer.rejects(new Error('Quit failed'));

            await commands.quitServer();

            assert.ok(showErrorMessageStub.called);
            const errorMessage = showErrorMessageStub.firstCall.args[0];
            assert.ok(errorMessage.includes('Failed to quit server'));
        });
    });

    suite('stopSound', () => {
        test('should stop sounds when connected', async () => {
            mockOSCClient.isConnected.returns(true);
            mockOSCClient.stopAllSounds.resolves();

            await commands.stopSound();

            assert.ok(mockOSCClient.stopAllSounds.calledOnce);
        });

        test('should connect first if not connected', async () => {
            mockOSCClient.isConnected.onFirstCall().returns(false);
            mockOSCClient.isConnected.onSecondCall().returns(true);
            mockOSCClient.connect.resolves();
            mockOSCClient.stopAllSounds.resolves();

            await commands.stopSound();

            assert.ok(mockOSCClient.connect.calledOnce);
            assert.ok(mockOSCClient.stopAllSounds.calledOnce);
        });

        test('should handle stop errors', async () => {
            mockOSCClient.isConnected.returns(true);
            mockOSCClient.stopAllSounds.rejects(new Error('Stop failed'));

            await commands.stopSound();

            assert.ok(showErrorMessageStub.called);
        });
    });

    suite('evalSelection', () => {
        test('should warn when no active editor', async () => {
            sinon.stub(vscode.window, 'activeTextEditor').value(undefined);

            await commands.evalSelection();

            assert.ok(showWarningMessageStub.calledWith('No active editor'));
        });
    });

    suite('evalFile', () => {
        test('should warn when no active editor', async () => {
            sinon.stub(vscode.window, 'activeTextEditor').value(undefined);

            await commands.evalFile();

            assert.ok(showWarningMessageStub.calledWith('No active editor'));
        });
    });
});

