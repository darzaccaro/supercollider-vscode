# Quick Start Guide

## Installation Complete! ✅

Your SuperCollider VSCode extension is ready to use.

## Quick Test (In VSCode)

1. **Open this project in VSCode**
   ```bash
   code /Users/dar/repos/music
   ```

2. **Launch Extension Development Host**
   - Press `F5` in VSCode
   - A new VSCode window will open with the extension loaded

3. **Test Syntax Highlighting**
   - In the new window, open `example.scd`
   - You should see syntax highlighting for SuperCollider code

4. **Test Commands** (requires SuperCollider installed)
   - Start sclang in a terminal: `sclang`
   - In the sclang terminal, enable OSC:
     ```supercollider
     thisProcess.openUDPPort(57120);
     OSCFunc({ |msg| msg[1].asString.interpret; }, '/interpret');
     ```
   - In VSCode, click "SC ○" in the status bar to connect
   - Open `example.scd`
   - Select a line and press `Cmd+Enter` (Mac) or `Ctrl+Enter` (Win/Linux)
   - The code should execute in sclang!

## Development Commands

```bash
# Watch for changes (auto-compile)
npm run watch

# Compile once
npm run compile

# Run tests
npm test

# Run linter
npm run lint
```

## Testing

### Unit Tests
Run without SuperCollider:
```bash
npm test
```

### Integration Tests
Require SuperCollider installed. Tests will automatically:
- Spawn sclang process
- Send OSC commands
- Verify responses
- Clean up processes

## Architecture Summary

```
┌──────────────────┐
│   VSCode Window  │
│                  │
│  ┌────────────┐  │
│  │ Extension  │  │      OSC          ┌─────────┐
│  │  (Client)  │──┼──────────────────►│ sclang  │
│  │            │  │   /interpret      │         │
│  │  LSP       │  │                   │         │
│  │  Client    │──┼──────────────────►│   LSP   │
│  └────────────┘  │    TCP :57121     │  Quark  │
└──────────────────┘                   └─────────┘
```

## Key Files

- **`src/extension.ts`** - Main entry point, registers commands
- **`src/oscClient.ts`** - Handles OSC communication with sclang
- **`src/languageClient.ts`** - LSP integration
- **`src/commands.ts`** - Command implementations
- **`syntaxes/supercollider.tmLanguage.json`** - Syntax highlighting rules

## Features Implemented

✅ **Syntax Highlighting**
- Keywords, classes, UGens, symbols, comments, strings

✅ **LSP Features** (requires LanguageServer Quark)
- Autocomplete
- Hover information
- Diagnostics
- Go-to-definition
- Find references

✅ **Server Control**
- Boot/quit server
- Evaluate code (selection or file)
- Stop all sounds

✅ **Status Bar**
- Connection indicator
- Click to connect

✅ **Keybindings**
- `Cmd+Enter` / `Ctrl+Enter`: Evaluate selection
- `Cmd+Shift+Enter` / `Ctrl+Shift+Enter`: Evaluate file
- `Cmd+.` / `Ctrl+.`: Stop all sounds

✅ **Testing**
- Unit tests with mocking
- Integration tests with sclang spawning
- CI/CD with GitHub Actions

## Next Steps

1. **Test the extension** in VSCode Extension Development Host
2. **Run the test suite** to verify everything works
3. **Customize** configuration in `.vscode/settings.json`
4. **Package for distribution**:
   ```bash
   npm install -g @vscode/vsce
   vsce package
   # Creates supercollider-vscode-0.1.0.vsix
   ```

## Troubleshooting

### "Command not found: sclang"
Install SuperCollider from https://supercollider.github.io/

### "OSC connection failed"
Make sure sclang is running with OSC enabled:
```supercollider
thisProcess.openUDPPort(57120);
OSCFunc({ |msg| msg[1].asString.interpret; }, '/interpret');
```

### "Language Server not found"
Install the LanguageServer Quark in SuperCollider:
```supercollider
Quarks.install("LanguageServer");
LanguageServer.start(57121);
```

## Resources

- [README.md](README.md) - Full documentation
- [CONTRIBUTING.md](CONTRIBUTING.md) - Development guidelines
- [PROJECT_STATUS.md](PROJECT_STATUS.md) - Implementation status
- [SuperCollider Docs](https://docs.supercollider.online/)

---

**Happy coding with SuperCollider in VSCode!** 🎵

