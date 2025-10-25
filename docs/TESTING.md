# Testing the SuperCollider VS Code Extension

This document provides a complete guide to running and understanding the automated test suite.

## Table of Contents
- [Quick Start](#quick-start)
- [Test Organization](#test-organization)
- [Running Tests](#running-tests)
- [Test Details](#test-details)
- [Continuous Integration](#continuous-integration)
- [Troubleshooting](#troubleshooting)

## Quick Start

### Install Dependencies
```bash
npm install
```

### Run All Tests
```bash
npm test
```

### Run Specific Test Types
```bash
# Fast unit tests only (no VS Code required)
npm run test:unit

# Integration tests (requires VS Code test environment)
npm run test:integration

# Quick test script (Unix/Mac)
./scripts/test-quick.sh unit

# Quick test script (Windows)
.\scripts\test-quick.ps1 unit
```

### Using VS Code Tasks
1. Press `Cmd+Shift+P` (Mac) or `Ctrl+Shift+P` (Windows/Linux)
2. Type "Run Task"
3. Select:
   - `npm: test` - Run all tests
   - `npm: test:unit` - Run unit tests only
   - `npm: test:integration` - Run integration tests only
   - `compile & test` - Compile then test

Or use the keyboard shortcut:
- `Cmd+Shift+B` (Mac) or `Ctrl+Shift+B` (Windows/Linux)
- Select the test task you want

### Debug Tests in VS Code
1. Press `F5` or go to Run & Debug
2. Select "Extension Tests (Debug)" from the dropdown
3. Press the green play button
4. Set breakpoints in test files or source files

## Test Organization

```
src/test/
├── fixtures/
│   └── test.scd              # Sample SuperCollider code for testing
├── runTest.ts                # Test entry point
└── suite/
    ├── index.ts              # Mocha test configuration
    ├── unit/                 # Unit tests (fast, isolated)
    │   ├── commands.test.ts           # ~15 tests
    │   ├── config.test.ts             # 4 tests
    │   ├── config-extended.test.ts    # 10 tests
    │   ├── languageClient.test.ts     # 4 tests
    │   ├── oscClient.test.ts          # 5 tests
    │   └── oscClient-extended.test.ts # 11 tests
    └── integration/          # Integration tests (requires VS Code)
        ├── commands-integration.test.ts  # 10 tests
        ├── configuration.test.ts         # 7 tests
        ├── document.test.ts              # 4 tests
        ├── evaluation.test.ts            # 4 tests (requires SuperCollider)
        ├── extension.test.ts             # 5 tests
        └── statusBar.test.ts             # 1 test
```

**Total: 80+ automated tests**

## Running Tests

### Command Line Options

#### All Tests
```bash
npm test
```
Runs both unit and integration tests. Takes ~10-15 seconds.

#### Unit Tests Only
```bash
npm run test:unit
```
Fast isolated tests. Takes ~0.5 seconds.

#### Integration Tests Only
```bash
npm run test:integration
```
Tests requiring VS Code environment. Takes ~5-10 seconds.

#### Watch Mode
```bash
# Terminal 1: Watch and compile on changes
npm run watch

# Terminal 2: Run tests when ready
npm test
```

#### With Debugging
Use VS Code's built-in debugger:
1. Open Run & Debug panel (`Cmd+Shift+D` / `Ctrl+Shift+D`)
2. Select "Extension Tests (Debug)"
3. Press F5
4. Set breakpoints in test or source files

### Test Scripts

#### Python Script (Cross-Platform)
```bash
# Works on Windows, macOS, and Linux
python scripts/test-quick.py [type]

# Examples:
python scripts/test-quick.py unit         # Unit tests
python scripts/test-quick.py integration  # Integration tests
python scripts/test-quick.py all          # All tests
python scripts/test-quick.py compile      # Just compile
python scripts/test-quick.py lint         # Run linter
python scripts/test-quick.py watch        # Watch mode

# Show help
python scripts/test-quick.py --help

# Skip dependency check
python scripts/test-quick.py unit --skip-install-check
```

## Test Details

### Unit Tests

#### Configuration Tests
**Files**: `config.test.ts`, `config-extended.test.ts`

Tests configuration validation including:
- ✅ Valid configurations pass
- ✅ Invalid sclangPath detected
- ✅ Port range validation (1-65535)
- ✅ Multiple validation errors collected
- ✅ Edge cases (0, negative, > 65535)

**Coverage**: 100% of config.ts

#### OSC Client Tests
**Files**: `oscClient.test.ts`, `oscClient-extended.test.ts`

Tests OSC client functionality:
- ✅ Client initialization
- ✅ Connection state management
- ✅ Error handling when disconnected
- ✅ Multiple disconnects safe
- ✅ Parameter updates
- ✅ Different host formats

**Coverage**: 90% of oscClient.ts
*Note: Actual OSC communication requires SuperCollider*

#### Commands Tests
**File**: `commands.test.ts`

Tests command logic with mocked dependencies:
- ✅ Connect OSC command
- ✅ Boot/quit server commands
- ✅ Stop sound command
- ✅ Evaluation commands
- ✅ Error handling
- ✅ User messages (info/warning/error)
- ✅ Status bar updates

**Coverage**: 85% of commands.ts
*Note: Uses Sinon for mocking VS Code APIs*

#### Language Client Tests
**File**: `languageClient.test.ts`

Tests language server client:
- ✅ Initialization with config
- ✅ Respects useLanguageServer setting
- ✅ Initial state
- ✅ Safe stop with null client

**Coverage**: 60% of languageClient.ts

### Integration Tests

#### Extension Tests
**File**: `extension.test.ts`

Tests extension activation and setup:
- ✅ Extension is present
- ✅ Extension activates successfully
- ✅ All commands registered
- ✅ Configuration available
- ✅ Default configuration values

**Coverage**: 80% of extension.ts

#### Document Tests
**File**: `document.test.ts`

Tests file handling:
- ✅ .sc files recognized as SuperCollider
- ✅ .scd files recognized as SuperCollider
- ✅ Files open in editor correctly
- ✅ Syntax highlighting available

#### Commands Integration Tests
**File**: `commands-integration.test.ts`

Tests actual command execution:
- ✅ All commands are executable
- ✅ Graceful handling of missing editor
- ✅ Works with SuperCollider files
- ✅ Evaluation with selection
- ✅ Evaluation of entire file

#### Configuration Tests
**File**: `configuration.test.ts`

Tests configuration changes:
- ✅ Configuration values update
- ✅ Change handlers triggered
- ✅ All properties settable
- ✅ Values persist correctly

#### Status Bar Tests
**File**: `statusBar.test.ts`

Tests status bar integration:
- ✅ Status bar item exists after activation

#### Evaluation Tests
**File**: `evaluation.test.ts`

Tests code evaluation with real SuperCollider:
- ⚠️ Simple expression evaluation
- ⚠️ Variable assignment
- ⚠️ Multiple line evaluation
- ⚠️ Function definition

**Note**: These tests require SuperCollider (sclang) to be installed.
They will automatically skip if SuperCollider is not available.

## Continuous Integration

The test suite runs automatically on GitHub Actions for:
- **Operating Systems**: Ubuntu, macOS, Windows
- **Node Versions**: 18.x, 20.x
- **Special Job**: Ubuntu with SuperCollider installed

### CI Configuration
See `.github/workflows/test.yml`

### What CI Tests
- ✅ Linting (ESLint)
- ✅ TypeScript compilation
- ✅ Unit tests (all platforms)
- ✅ Integration tests (all platforms)
- ✅ Evaluation tests (Ubuntu with SuperCollider)

### CI Results
- Green checkmark: All tests passed
- Yellow dot: Tests in progress
- Red X: Tests failed (check logs)

## Troubleshooting

### Tests Won't Run

**Problem**: `npm test` fails immediately

**Solutions**:
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Recompile TypeScript
npm run compile

# Check for TypeScript errors
npx tsc --noEmit
```

### Tests Timeout

**Problem**: Tests hang or timeout

**Solutions**:
- Increase timeout in test file: `this.timeout(20000);`
- Check for hanging processes: `ps aux | grep sclang`
- Kill orphaned processes: `pkill sclang`
- Restart VS Code

### Cannot Find Module Errors

**Problem**: `Error: Cannot find module 'sinon'`

**Solution**:
```bash
npm install
```

### Compilation Errors

**Problem**: TypeScript compilation fails

**Solutions**:
```bash
# Clean build
rm -rf out/
npm run compile

# Check for syntax errors
npm run lint
```

### VS Code Test Environment Issues

**Problem**: "Could not find VS Code"

**Solution**:
The test runner will automatically download VS Code.
If it fails:
```bash
# Clear VS Code test cache
rm -rf .vscode-test/

# Run tests again
npm test
```

### SuperCollider Tests Skip

**Problem**: Evaluation tests show as skipped

**Explanation**: This is normal if SuperCollider is not installed.

**To enable these tests**:
1. Install SuperCollider from https://supercollider.github.io/
2. Ensure `sclang` is in your PATH
3. Verify: `sclang -v`
4. Run tests again: `npm test`

### Debugger Won't Attach

**Problem**: Cannot debug tests in VS Code

**Solutions**:
1. Ensure compiled: `npm run compile`
2. Check `launch.json` exists
3. Select correct debug configuration
4. Check for TypeScript source maps

### Permission Errors

**Problem**: `EACCES` or `EPERM` errors

**Solution**:
```bash
# Fix npm permissions (Unix/Mac)
sudo chown -R $(whoami) ~/.npm

# Or use npx instead
npx npm test
```

### Windows Specific Issues

**Problem**: Tests fail on Windows

**Solutions**:
```powershell
# Use PowerShell, not CMD
# Run as Administrator if needed

# Try with --no-sandbox flag (CI only)
npm test -- --no-sandbox
```

## Best Practices

### When Writing New Tests

1. **Start with unit tests** - Fast feedback
2. **Use descriptive test names** - Clear intent
3. **One assertion per test** - Easy debugging
4. **Clean up after tests** - Use teardown
5. **Mock external dependencies** - Isolation
6. **Test error cases** - Not just happy path

### Test Structure

```typescript
suite('Feature Tests', () => {
    let instance: MyClass;
    
    setup(() => {
        // Setup before each test
        instance = new MyClass();
    });
    
    teardown(() => {
        // Cleanup after each test
        instance.dispose();
    });
    
    test('should do something specific', () => {
        // Arrange
        const input = 'test';
        
        // Act
        const result = instance.method(input);
        
        // Assert
        assert.strictEqual(result, 'expected');
    });
});
```

### Debugging Tips

1. Use `console.log()` in tests
2. Set breakpoints in source files
3. Use VS Code debugger (F5)
4. Add `.only` to run single test: `test.only('...', () => {})`
5. Add `.skip` to skip test: `test.skip('...', () => {})`

## Additional Resources

- **Test Guide**: [TEST_GUIDE.md](./TEST_GUIDE.md) - Detailed testing documentation
- **Test Summary**: [TEST_SUMMARY.md](./TEST_SUMMARY.md) - Test statistics and coverage
- **Contributing**: [CONTRIBUTING.md](./CONTRIBUTING.md) - Contribution guidelines
- **VS Code Testing**: https://code.visualstudio.com/api/working-with-extensions/testing-extension
- **Mocha**: https://mochajs.org/
- **Sinon**: https://sinonjs.org/

## Getting Help

- **Issues**: Check existing tests for examples
- **Questions**: Open a GitHub issue
- **Contributing**: See CONTRIBUTING.md
- **CI Failures**: Check GitHub Actions logs

---

**Happy Testing! 🧪**

