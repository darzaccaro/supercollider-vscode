import * as vscode from 'vscode';

export interface SuperColliderConfig {
    sclangPath: string;
    oscHost: string;
    oscPort: number;
    useLanguageServer: boolean;
    languageServerPort: number;
}

export function getConfig(): SuperColliderConfig {
    const config = vscode.workspace.getConfiguration('supercollider');
    
    return {
        sclangPath: config.get<string>('sclangPath', 'sclang'),
        oscHost: config.get<string>('oscHost', '127.0.0.1'),
        oscPort: config.get<number>('oscPort', 57120),
        useLanguageServer: config.get<boolean>('useLanguageServer', true),
        languageServerPort: config.get<number>('languageServerPort', 57121)
    };
}

export function validateConfig(config: SuperColliderConfig): string[] {
    const errors: string[] = [];
    
    if (!config.sclangPath) {
        errors.push('sclangPath cannot be empty');
    }
    
    if (config.oscPort < 1 || config.oscPort > 65535) {
        errors.push('oscPort must be between 1 and 65535');
    }
    
    if (config.languageServerPort < 1 || config.languageServerPort > 65535) {
        errors.push('languageServerPort must be between 1 and 65535');
    }
    
    return errors;
}

