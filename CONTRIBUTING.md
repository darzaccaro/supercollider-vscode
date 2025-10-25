# Contributing to SuperCollider VSCode Extension

Thank you for your interest in contributing! This document provides guidelines for contributing to the project.

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/supercollider-vscode.git
   cd supercollider-vscode
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Compile the extension**:
   ```bash
   npm run compile
   ```

## Development Workflow

### Running the Extension

1. Open the project in VS Code
2. Press `F5` to launch the Extension Development Host
3. Open a `.sc` or `.scd` file to test the extension
4. Make changes and reload (`Cmd+R` / `Ctrl+R`) the development host

### Watch Mode

During development, use watch mode to automatically recompile on changes:

```bash
npm run watch
```

### Testing

Always add tests for new features:

```bash
# Run all tests
npm test

# Tests are in src/test/suite/
# - unit/ for unit tests
# - integration/ for integration tests
```

#### Writing Tests

- **Unit tests** should mock external dependencies
- **Integration tests** can spawn sclang but should gracefully skip if unavailable
- Use descriptive test names
- Follow existing test patterns

Example:
```typescript
test('Feature does X when Y', async () => {
    // Arrange
    const input = setupInput();
    
    // Act
    const result = await performAction(input);
    
    // Assert
    assert.strictEqual(result, expectedValue);
});
```

### Code Style

- Follow TypeScript best practices
- Use meaningful variable and function names
- Add JSDoc comments for public APIs
- Run linter before committing:
  ```bash
  npm run lint
  ```

## Project Structure

```
supercollider-vscode/
├── src/
│   ├── extension.ts        # Main entry point
│   ├── config.ts           # Configuration management
│   ├── oscClient.ts        # OSC communication
│   ├── languageClient.ts   # LSP integration
│   ├── commands.ts         # Command implementations
│   └── test/               # Tests
├── syntaxes/
│   └── supercollider.tmLanguage.json  # Syntax highlighting
├── package.json            # Extension manifest
└── README.md
```

## Pull Request Process

1. **Create a branch** for your feature:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** with clear commit messages:
   ```bash
   git commit -m "Add feature: description"
   ```

3. **Update documentation** if needed:
   - Update README.md for user-facing changes
   - Update CHANGELOG.md
   - Add JSDoc comments to code

4. **Test your changes**:
   ```bash
   npm run compile
   npm test
   npm run lint
   ```

5. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request** on GitHub with:
   - Clear description of changes
   - Link to related issues
   - Screenshots/GIFs for UI changes

## What to Contribute

### Good First Issues

- Improve syntax highlighting patterns
- Add more keyboard shortcuts
- Enhance error messages
- Fix typos in documentation
- Add more test cases

### Feature Ideas

- Additional LSP features
- Better error handling
- Performance optimizations
- More configuration options
- Integration with SC server meters
- Post window integration

### Bug Reports

If you find a bug, please open an issue with:

- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- VS Code version
- SuperCollider version
- Extension version
- Error messages or logs

## Code Review

All submissions require review. We use GitHub pull requests for this purpose.

Reviewers will check for:
- Code quality and style
- Test coverage
- Documentation
- Backward compatibility
- Performance implications

## Community Guidelines

- Be respectful and constructive
- Follow the [Code of Conduct](https://github.com/supercollider/supercollider/blob/develop/CODE_OF_CONDUCT.md)
- Help others in issues and discussions
- Share knowledge and learn together

## Questions?

- Open a GitHub issue for bugs or feature requests
- Join the [SuperCollider Forum](https://scsynth.org/) for general discussion
- Check existing issues and pull requests before creating new ones

## License

By contributing, you agree that your contributions will be licensed under the GNU General Public License v3.0.

---

Thank you for contributing to make SuperCollider better! 🎵

