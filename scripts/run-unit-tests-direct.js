#!/usr/bin/env node
/**
 * Direct unit test runner that bypasses VS Code test harness
 * This allows unit tests to run on macOS without the compatibility issues
 */

const Mocha = require('mocha');
const glob = require('glob');
const path = require('path');
const Module = require('module');

// Mock the vscode module before loading any tests
const originalRequire = Module.prototype.require;
Module.prototype.require = function(id) {
    if (id === 'vscode') {
        return require('./vscode-mock');
    }
    return originalRequire.apply(this, arguments);
};

// Create mocha instance
const mocha = new Mocha({
    ui: 'tdd',
    color: true,
    timeout: 10000
});

// Root directory for tests
const testsRoot = path.resolve(__dirname, '../out/test/suite');

console.log('🧪 Running Unit Tests Directly (bypassing VS Code harness)');
console.log('='.repeat(60));
console.log('');

// Find all unit test files
const testFiles = glob.sync('unit/**/*.test.js', { cwd: testsRoot });

if (testFiles.length === 0) {
    console.error('❌ No test files found. Make sure you ran: npm run compile');
    process.exit(1);
}

console.log(`Found ${testFiles.length} unit test files:\n`);
testFiles.forEach(f => console.log(`  - ${f}`));
console.log('');

// Add files to mocha
testFiles.forEach(f => {
    mocha.addFile(path.resolve(testsRoot, f));
});

// Run the tests
console.log('Running tests...\n');
mocha.run(failures => {
    console.log('');
    if (failures > 0) {
        console.error(`❌ ${failures} test(s) failed`);
        process.exit(1);
    } else {
        console.log('✅ All tests passed!');
        process.exit(0);
    }
});

