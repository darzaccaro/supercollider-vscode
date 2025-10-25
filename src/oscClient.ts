import * as osc from 'osc';
import * as vscode from 'vscode';

export class OSCClient {
    private udpPort: osc.UDPPort | null = null;
    private host: string;
    private port: number;
    private connected = false;

    constructor(host: string, port: number) {
        this.host = host;
        this.port = port;
    }

    async connect(): Promise<void> {
        if (this.connected) {
            return;
        }

        return new Promise((resolve, reject) => {
            try {
                this.udpPort = new osc.UDPPort({
                    localAddress: '0.0.0.0',
                    localPort: 0,
                    remoteAddress: this.host,
                    remotePort: this.port,
                    metadata: true
                });

                this.udpPort.on('ready', () => {
                    this.connected = true;
                    console.log('OSC Client connected to', this.host, this.port);
                    resolve();
                });

                this.udpPort.on('error', (err: Error) => {
                    console.error('OSC Error:', err);
                    reject(err);
                });

                this.udpPort.on('message', (oscMsg: any) => {
                    console.log('Received OSC message:', oscMsg);
                });

                this.udpPort.open();
            } catch (err) {
                reject(err);
            }
        });
    }

    disconnect(): void {
        if (this.udpPort) {
            this.udpPort.close();
            this.udpPort = null;
            this.connected = false;
        }
    }

    isConnected(): boolean {
        return this.connected;
    }

    private sendMessage(address: string, args: osc.MetaArgument[] = []): void {
        if (!this.udpPort || !this.connected) {
            throw new Error('OSC client is not connected');
        }

        this.udpPort.send({
            address: address,
            args: args
        });
    }

    async sendEval(code: string): Promise<void> {
        try {
            // SuperCollider expects code evaluation via /interpret or similar
            // The exact OSC message format may need adjustment based on sclang setup
            this.sendMessage('/interpret', [
                {
                    type: 's',
                    value: code
                }
            ]);
        } catch (err) {
            vscode.window.showErrorMessage(`Failed to evaluate code: ${err}`);
            throw err;
        }
    }

    async bootServer(): Promise<void> {
        try {
            // Send command to boot the SuperCollider server
            this.sendMessage('/cmd', [
                {
                    type: 's',
                    value: 'Server.default.boot;'
                }
            ]);
        } catch (err) {
            vscode.window.showErrorMessage(`Failed to boot server: ${err}`);
            throw err;
        }
    }

    async quitServer(): Promise<void> {
        try {
            // Send command to quit the SuperCollider server
            this.sendMessage('/cmd', [
                {
                    type: 's',
                    value: 'Server.default.quit;'
                }
            ]);
        } catch (err) {
            vscode.window.showErrorMessage(`Failed to quit server: ${err}`);
            throw err;
        }
    }

    async stopAllSounds(): Promise<void> {
        try {
            // Send freeAll command to stop all synths
            this.sendMessage('/cmd', [
                {
                    type: 's',
                    value: 'Server.default.freeAll;'
                }
            ]);
        } catch (err) {
            vscode.window.showErrorMessage(`Failed to stop sounds: ${err}`);
            throw err;
        }
    }

    updateConnection(host: string, port: number): void {
        const needsReconnect = this.host !== host || this.port !== port;
        
        this.host = host;
        this.port = port;
        
        if (needsReconnect && this.connected) {
            this.disconnect();
        }
    }
}

