# Change Log

All notable changes to the "SuperCollider" extension will be documented in this file.

## [0.1.0] - Initial Release

### Added
- Syntax highlighting for `.sc` and `.scd` files
- TextMate grammar with support for:
  - Keywords and control structures
  - Class names and UGens
  - Symbols, strings, and numbers
  - Comments (single and multi-line)
- Language Server Protocol (LSP) integration
  - Autocomplete
  - Hover information
  - Diagnostics
  - Go-to-definition
  - Find references
- OSC-based server communication
  - Boot/quit SuperCollider server
  - Evaluate code (selection or file)
  - Stop all sounds
- VSCode commands
  - Connect to sclang
  - Start Language Server
  - Boot/quit server
  - Evaluate code
  - Stop sounds
- Keyboard shortcuts
  - `Cmd+Enter` / `Ctrl+Enter`: Evaluate selection
  - `Cmd+Shift+Enter` / `Ctrl+Shift+Enter`: Evaluate file
  - `Cmd+.` / `Ctrl+.`: Stop all sounds
- Status bar integration showing connection status
- Configuration options for paths and ports
- Comprehensive test suite
  - Unit tests for core modules
  - Integration tests with sclang
  - CI/CD with GitHub Actions
- Documentation
  - Complete README with setup instructions
  - Troubleshooting guide
  - Architecture overview

### Technical Details
- Built with TypeScript
- Uses `vscode-languageclient` for LSP
- Uses `osc` library for OSC communication
- Automated testing with Mocha
- Cross-platform support (macOS, Linux, Windows)

