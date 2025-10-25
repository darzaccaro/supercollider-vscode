import * as assert from 'assert';
import { validateConfig, SuperColliderConfig } from '../../../config';

suite('Config Extended Unit Tests', () => {
    test('Should accept minimum valid port (1)', () => {
        const config: SuperColliderConfig = {
            sclangPath: 'sclang',
            oscHost: '127.0.0.1',
            oscPort: 1,
            useLanguageServer: true,
            languageServerPort: 1
        };

        const errors = validateConfig(config);
        assert.strictEqual(errors.length, 0);
    });

    test('Should accept maximum valid port (65535)', () => {
        const config: SuperColliderConfig = {
            sclangPath: 'sclang',
            oscHost: '127.0.0.1',
            oscPort: 65535,
            useLanguageServer: true,
            languageServerPort: 65535
        };

        const errors = validateConfig(config);
        assert.strictEqual(errors.length, 0);
    });

    test('Should reject port 0', () => {
        const config: SuperColliderConfig = {
            sclangPath: 'sclang',
            oscHost: '127.0.0.1',
            oscPort: 0,
            useLanguageServer: true,
            languageServerPort: 57121
        };

        const errors = validateConfig(config);
        assert.ok(errors.some(e => e.includes('oscPort')));
    });

    test('Should reject port above 65535', () => {
        const config: SuperColliderConfig = {
            sclangPath: 'sclang',
            oscHost: '127.0.0.1',
            oscPort: 65536,
            useLanguageServer: true,
            languageServerPort: 57121
        };

        const errors = validateConfig(config);
        assert.ok(errors.some(e => e.includes('oscPort')));
    });

    test('Should reject negative port', () => {
        const config: SuperColliderConfig = {
            sclangPath: 'sclang',
            oscHost: '127.0.0.1',
            oscPort: -1,
            useLanguageServer: true,
            languageServerPort: 57121
        };

        const errors = validateConfig(config);
        assert.ok(errors.some(e => e.includes('oscPort')));
    });

    test('Should collect multiple errors', () => {
        const config: SuperColliderConfig = {
            sclangPath: '',
            oscHost: '127.0.0.1',
            oscPort: 70000,
            useLanguageServer: true,
            languageServerPort: -1
        };

        const errors = validateConfig(config);
        assert.strictEqual(errors.length, 3);
        assert.ok(errors.some(e => e.includes('sclangPath')));
        assert.ok(errors.some(e => e.includes('oscPort')));
        assert.ok(errors.some(e => e.includes('languageServerPort')));
    });

    test('Should accept IPv4 addresses', () => {
        const config: SuperColliderConfig = {
            sclangPath: 'sclang',
            oscHost: '192.168.1.1',
            oscPort: 57120,
            useLanguageServer: true,
            languageServerPort: 57121
        };

        const errors = validateConfig(config);
        assert.strictEqual(errors.length, 0);
    });

    test('Should accept localhost', () => {
        const config: SuperColliderConfig = {
            sclangPath: 'sclang',
            oscHost: 'localhost',
            oscPort: 57120,
            useLanguageServer: true,
            languageServerPort: 57121
        };

        const errors = validateConfig(config);
        assert.strictEqual(errors.length, 0);
    });

    test('Should accept custom sclang path', () => {
        const config: SuperColliderConfig = {
            sclangPath: '/usr/local/bin/sclang',
            oscHost: '127.0.0.1',
            oscPort: 57120,
            useLanguageServer: true,
            languageServerPort: 57121
        };

        const errors = validateConfig(config);
        assert.strictEqual(errors.length, 0);
    });

    test('Should validate with useLanguageServer false', () => {
        const config: SuperColliderConfig = {
            sclangPath: 'sclang',
            oscHost: '127.0.0.1',
            oscPort: 57120,
            useLanguageServer: false,
            languageServerPort: 57121
        };

        const errors = validateConfig(config);
        assert.strictEqual(errors.length, 0);
    });
});

