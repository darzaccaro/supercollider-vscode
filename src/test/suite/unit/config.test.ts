import * as assert from 'assert';
import { validateConfig, SuperColliderConfig } from '../../../config';

suite('Config Unit Tests', () => {
    test('Valid configuration passes validation', () => {
        const config: SuperColliderConfig = {
            sclangPath: 'sclang',
            oscHost: '127.0.0.1',
            oscPort: 57120,
            useLanguageServer: true,
            languageServerPort: 57121
        };

        const errors = validateConfig(config);
        assert.strictEqual(errors.length, 0);
    });

    test('Empty sclangPath fails validation', () => {
        const config: SuperColliderConfig = {
            sclangPath: '',
            oscHost: '127.0.0.1',
            oscPort: 57120,
            useLanguageServer: true,
            languageServerPort: 57121
        };

        const errors = validateConfig(config);
        assert.ok(errors.some(e => e.includes('sclangPath')));
    });

    test('Invalid oscPort fails validation', () => {
        const config: SuperColliderConfig = {
            sclangPath: 'sclang',
            oscHost: '127.0.0.1',
            oscPort: 70000,
            useLanguageServer: true,
            languageServerPort: 57121
        };

        const errors = validateConfig(config);
        assert.ok(errors.some(e => e.includes('oscPort')));
    });

    test('Invalid languageServerPort fails validation', () => {
        const config: SuperColliderConfig = {
            sclangPath: 'sclang',
            oscHost: '127.0.0.1',
            oscPort: 57120,
            useLanguageServer: true,
            languageServerPort: 0
        };

        const errors = validateConfig(config);
        assert.ok(errors.some(e => e.includes('languageServerPort')));
    });
});

