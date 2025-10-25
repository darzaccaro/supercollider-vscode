declare module 'osc' {
    export interface MetaArgument {
        type: string;
        value: any;
    }

    export interface OSCMessage {
        address: string;
        args: MetaArgument[];
    }

    export interface UDPPortOptions {
        localAddress?: string;
        localPort?: number;
        remoteAddress?: string;
        remotePort?: number;
        broadcast?: boolean;
        multicastTTL?: number;
        multicastMembership?: string[];
        metadata?: boolean;
    }

    export class UDPPort {
        constructor(options: UDPPortOptions);
        open(): void;
        close(): void;
        send(msg: OSCMessage | OSCMessage[], address?: string, port?: number): void;
        on(event: string, callback: (...args: any[]) => void): void;
        off(event: string, callback: (...args: any[]) => void): void;
    }
}

