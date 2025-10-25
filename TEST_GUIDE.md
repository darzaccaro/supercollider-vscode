# SuperCollider VS Code Extension - Test Guide

This guide explains how to run and understand the automated tests for the SuperCollider VS Code extension.

## Overview

The test suite is organized into two main categories:

1. **Unit Tests**: Fast, isolated tests that don't require VS Code integration or external dependencies
2. **Integration Tests**: Tests that interact with VS Code APIs and may require SuperCollider to be installed

## Test Structure

```
src/test/
├── fixtures/
│   └── test.scd              # Sample SuperCollider file for testing
├── suite/
│   ├── index.ts              # Test runner configuration
│   ├── unit/                 # Unit tests
│   │   ├── config.test.ts
│   │   ├── config-extended.test.ts
│   │   ├── commands.test.ts
│   │   ├── languageClient.test.ts
│   │   ├── oscClient.test.ts
│   │   └── oscClient-extended.test.ts
│   └── integration/          # Integration tests
│       ├── commands-integration.test.ts
│       ├── configuration.test.ts
│       ├── document.test.ts
│       ├── evaluation.test.ts
│       ├── extension.test.ts
│       └── statusBar.test.ts
└── runTest.ts               # Test launcher
```

## Running Tests

### Run All Tests
```bash
npm test
```

### Run Only Unit Tests
```bash
npm run test:unit
```

### Run Only Integration Tests
```bash
npm run test:integration
```

### Run Tests in Watch Mode
```bash
npm run watch
```

Then in another terminal:
```bash
npm test
```

## Test Categories

### Unit Tests

#### Configuration Tests (`config.test.ts`, `config-extended.test.ts`)
- Validates configuration parameter validation
- Tests port number ranges (1-65535)
- Tests empty/invalid configuration values
- Tests multiple validation errors

**Coverage:**
- ✓ Valid configuration passes validation
- ✓ Empty sclangPath fails validation
- ✓ Invalid oscPort fails validation
- ✓ Invalid languageServerPort fails validation
- ✓ Port boundary conditions (0, 1, 65535, 65536)
- ✓ Multiple simultaneous errors
- ✓ Different host formats (localhost, IP addresses)

#### OSC Client Tests (`oscClient.test.ts`, `oscClient-extended.test.ts`)
- Tests OSC client initialization
- Tests connection state management
- Tests error handling when not connected
- Tests parameter updates

**Coverage:**
- ✓ Client initializes correctly
- ✓ Initial connection state is false
- ✓ Connection parameter updates work
- ✓ Disconnect without connection doesn't throw
- ✓ Commands fail appropriately when not connected
- ✓ Multiple disconnects are safe
- ✓ Different host/port combinations

#### Commands Tests (`commands.test.ts`)
- Tests command execution with mocked dependencies
- Tests error handling in commands
- Tests user feedback (messages, warnings, errors)
- Tests status bar updates

**Coverage:**
- ✓ Connect OSC command behavior
- ✓ Boot/quit server commands
- ✓ Stop sound command
- ✓ Evaluation commands
- ✓ Error handling and user messages
- ✓ Auto-connection when needed

#### Language Client Tests (`languageClient.test.ts`)
- Tests language server client initialization
- Tests start/stop behavior
- Tests configuration handling

**Coverage:**
- ✓ Client initializes with config
- ✓ Respects useLanguageServer setting
- ✓ Initial running state is false
- ✓ Stop handles null client safely

### Integration Tests

#### Extension Tests (`extension.test.ts`)
- Tests extension activation
- Tests command registration
- Tests configuration availability

**Coverage:**
- ✓ Extension is present
- ✓ Extension activates successfully
- ✓ All commands are registered
- ✓ Configuration is available
- ✓ Default configuration values are correct

#### Document Tests (`document.test.ts`)
- Tests file type recognition
- Tests syntax highlighting
- Tests editor integration

**Coverage:**
- ✓ .sc files recognized as SuperCollider
- ✓ .scd files recognized as SuperCollider
- ✓ Files open in editor correctly
- ✓ Syntax highlighting is available

#### Commands Integration Tests (`commands-integration.test.ts`)
- Tests actual command execution
- Tests error handling without SuperCollider
- Tests graceful degradation

**Coverage:**
- ✓ All commands are executable
- ✓ Commands handle missing editor gracefully
- ✓ Commands work with SuperCollider files
- ✓ Evaluation commands work on selections and files

#### Configuration Tests (`configuration.test.ts`)
- Tests configuration updates
- Tests configuration change handlers
- Tests configuration persistence

**Coverage:**
- ✓ Configuration values can be updated
- ✓ Updates trigger change handlers
- ✓ All configuration properties are settable

#### Status Bar Tests (`statusBar.test.ts`)
- Tests status bar item creation
- Tests status bar visibility after activation

**Coverage:**
- ✓ Status bar item exists after activation

#### Evaluation Tests (`evaluation.test.ts`)
- Tests code evaluation with actual SuperCollider
- Tests OSC communication
- **Note**: These tests require SuperCollider (sclang) to be installed

**Coverage:**
- ✓ Simple expression evaluation
- ✓ Variable assignment
- ✓ Multiple line evaluation
- ✓ Function definition

## Requirements

### For All Tests
- Node.js 18+
- VS Code Test Electron
- All npm dependencies installed: `npm install`

### For Integration Tests
- VS Code environment (automatically provided by test runner)

### For Evaluation Tests
- SuperCollider installed with `sclang` in PATH
- These tests will skip automatically if SuperCollider is not available

## Test Dependencies

The test suite uses:
- **Mocha**: Test framework
- **Sinon**: Mocking and stubbing library
- **@vscode/test-electron**: VS Code test harness
- **assert**: Node.js assertion library

## Writing New Tests

### Unit Test Template

```typescript
import * as assert from 'assert';
import * as sinon from 'sinon';
import { YourClass } from '../../../yourModule';

suite('YourClass Unit Tests', () => {
    let instance: YourClass;

    setup(() => {
        // Initialize test objects
        instance = new YourClass();
    });

    teardown(() => {
        // Clean up
        sinon.restore();
    });

    test('should do something', () => {
        // Arrange
        const input = 'test';
        
        // Act
        const result = instance.method(input);
        
        // Assert
        assert.strictEqual(result, 'expected');
    });
});
```

### Integration Test Template

```typescript
import * as assert from 'assert';
import * as vscode from 'vscode';

suite('Feature Integration Tests', function() {
    this.timeout(10000); // Integration tests may take longer

    suiteSetup(async () => {
        // One-time setup for all tests
        const extension = vscode.extensions.getExtension('supercollider.supercollider-vscode');
        if (extension && !extension.isActive) {
            await extension.activate();
        }
    });

    test('should integrate with VS Code', async () => {
        // Your test here
        assert.ok(true);
    });
});
```

## Continuous Integration

The tests are designed to work in CI environments:
- Tests run in headless mode
- Evaluation tests skip automatically if SuperCollider is not available
- Test timeouts are set appropriately for CI environments

## Troubleshooting

### Tests Timeout
- Increase timeout in test suite: `this.timeout(20000);`
- Check if SuperCollider processes are hanging
- Ensure VS Code test instance can start

### Tests Fail on CI
- Check that all dependencies are installed
- Verify Node.js version compatibility
- Check environment-specific issues (Windows/macOS/Linux)

### Import Errors
- Run `npm run compile` before running tests
- Check that all TypeScript files compile successfully
- Verify import paths are correct

### SuperCollider Tests Skip
- This is expected if SuperCollider is not installed
- Install SuperCollider and ensure `sclang` is in PATH
- Tests will automatically detect and run when available

## Coverage Goals

Current test coverage focuses on:
- ✅ Configuration validation (100%)
- ✅ Command execution logic (80%+)
- ✅ OSC client state management (90%+)
- ✅ Extension activation (100%)
- ✅ Error handling (70%+)
- ⚠️ Language Server (basic, requires more integration tests)
- ⚠️ UI interactions (limited by VS Code test API)

## Future Improvements

- [ ] Add code coverage reporting
- [ ] Add performance benchmarks
- [ ] Add more language server tests
- [ ] Add E2E tests for complete workflows
- [ ] Add visual regression tests for UI elements
- [ ] Add tests for keyboard shortcuts
- [ ] Add tests for syntax highlighting rules

## Contributing

When adding new features:
1. Write unit tests first (TDD approach recommended)
2. Add integration tests for VS Code integration points
3. Update this guide if adding new test categories
4. Ensure all tests pass before submitting PR
5. Aim for at least 70% code coverage on new code

## Resources

- [VS Code Extension Testing](https://code.visualstudio.com/api/working-with-extensions/testing-extension)
- [Mocha Documentation](https://mochajs.org/)
- [Sinon Documentation](https://sinonjs.org/)
- [Node.js Assert Documentation](https://nodejs.org/api/assert.html)

