# Change Log

## [0.1.0] - 2025-10-26

### Initial Release

#### Features

**Core Functionality**
- ✨ Syntax highlighting for `.sc` and `.scd` files
- ✨ Code evaluation with `Cmd+Enter` / `Ctrl+Enter`
- ✨ Smart block evaluation - automatically evaluates entire `( ... )` blocks
- ✨ Single line evaluation when cursor is outside blocks
- ✨ Selection evaluation for precise code execution
- ✨ File evaluation with `Cmd+Shift+Enter` / `Ctrl+Shift+Enter`

**Help System**
- 📚 Integrated help system with `Cmd+D` / `Ctrl+D`
- 📚 Opens local SuperCollider help files (HTML or .scd)
- 📚 Automatic fallback to online documentation at doc.sccode.org
- 📚 Smart symbol detection for classes, methods, and UGens
- 📚 Side-by-side help viewing in VS Code

**Server Control**
- 🎵 Boot SuperCollider server
- 🎵 Quit SuperCollider server
- 🎵 Emergency stop all sounds with `Cmd+.` / `Ctrl+.`
- 🎵 Visual feedback for evaluated code

**Communication**
- 🔌 OSC (Open Sound Control) integration with sclang
- 🔌 Real-time connection status in status bar
- 🔌 Automatic connection management
- 🔌 Configuration for custom OSC host/port

**Language Server Protocol (Optional)**
- 🔧 Language Server Protocol support
- 🔧 Configurable LSP port
- 🔧 Auto-start option for language server

#### Commands

- `SuperCollider: Connect to sclang` - Connect to SuperCollider via OSC
- `SuperCollider: Start Language Server` - Start the Language Server
- `SuperCollider: Boot Server` - Boot the audio server
- `SuperCollider: Quit Server` - Quit the audio server
- `SuperCollider: Evaluate Selection` - Evaluate code at cursor or selection
- `SuperCollider: Evaluate File` - Evaluate entire file
- `SuperCollider: Stop All Sounds` - Emergency stop (Cmd+.)
- `SuperCollider: Open Help for Symbol` - Open help documentation (Cmd+D)

#### Keyboard Shortcuts

| Command | Mac | Windows/Linux |
|---------|-----|---------------|
| Evaluate code | `Cmd+Enter` | `Ctrl+Enter` |
| Evaluate file | `Cmd+Shift+Enter` | `Ctrl+Shift+Enter` |
| Stop sounds | `Cmd+.` | `Ctrl+.` |
| Open help | `Cmd+D` | `Ctrl+D` |

#### Configuration Options

- `supercollider.sclangPath` - Path to sclang executable (default: "sclang")
- `supercollider.oscHost` - OSC host address (default: "127.0.0.1")
- `supercollider.oscPort` - OSC port (default: 57120)
- `supercollider.useLanguageServer` - Enable LSP (default: true)
- `supercollider.languageServerPort` - LSP port (default: 57121)

#### Platform Support

- ✅ macOS (tested on macOS 15.6.1)
- ✅ Linux (untested)
- ✅ Windows (untested)

#### Requirements

- VS Code 1.75.0 or higher
- Node.js 18.x or higher
- SuperCollider 3.12 or higher (for full functionality)

#### Known Limitations

- Language Server features require SuperCollider LanguageServer Quark
- Local help requires SuperCollider installation
- OSC communication requires sclang/scide to be running

#### Credits

- Created by Dar Zaccaro

---

## Future Releases

### Unplanned Features That Would Be Cool

- [ ] Snippet library for common patterns
- [ ] Enhanced LSP integration
- [ ] Inline documentation on hover
- [ ] Auto-completion improvements
- [ ] Debugging support
- [ ] REPL integration
- [ ] Server meter visualization
- [ ] Scope visualization
- [ ] Post window in VS Code
- [ ] SynthDef visualization

### Feedback

Please report issues and feature requests at:
https://github.com/yourusername/sc-ext/issues
