# Help System Integration

## ✨ Feature: Integrated Help Documentation

The extension now includes full integration with SuperCollider's help system, just like scide!

## How to Use

### Quick Access: `Cmd+D` / `Ctrl+D`

1. Place your cursor on any symbol (class, method, UGen, etc.)
2. Press `Cmd+D` (Mac) or `Ctrl+D` (Windows/Linux)
3. Help documentation opens automatically!

### Examples

#### Opening Help for a Class

```supercollider
SinOsc.ar(440, 0, 0.3)
```

Place cursor on `SinOsc` → Press `Cmd+D` → Opens SinOsc help

#### Opening Help for a Method

```supercollider
Server.default.boot
```

Place cursor on `Server` → Press `Cmd+D` → Opens Server help
Place cursor on `boot` → Press `Cmd+D` → Opens boot method help

#### Opening Help for Topics

```supercollider
Pbind  // Place cursor here, press Cmd+D
Env    // Opens Env help
GUI    // Opens GUI help
```

## How It Works

### 1. Local Help (Preferred)

The extension first tries to find the help file installed with SuperCollider:

- Executes `sclang` to query the help system
- Uses SuperCollider's internal `Help.findHelpFile()` method
- Opens the actual help file from your SC installation

**Local help formats supported:**
- `.html` files → Opens in default browser
- `.scd` files → Opens in VS Code editor (side-by-side)
- `.rtf` files → Opens in system viewer

### 2. Online Fallback

If local help isn't found (or sclang isn't available), automatically opens:

```
https://doc.sccode.org/Classes/[Symbol].html
```

This is the official SuperCollider online documentation mirror.

### 3. Smart Symbol Detection

The extension intelligently extracts the symbol under your cursor:
- Handles class names: `SinOsc`, `Server`, `Array`
- Handles method names: `boot`, `play`, `free`
- Handles operators: `+`, `*`, `++`
- Handles special symbols: `\symbol`, `'string'`

## Configuration

The help system uses your configured `sclangPath` setting:

```json
{
    "supercollider.sclangPath": "/path/to/sclang"
}
```

Make sure this points to your SuperCollider installation.

## Comparison with scide

| Feature | scide | This Extension |
|---------|-------|----------------|
| Keyboard shortcut | `Cmd+D` / `Ctrl+D` | ✅ `Cmd+D` / `Ctrl+D` |
| Local help files | ✅ | ✅ |
| Online fallback | ❌ | ✅ |
| HTML help | ✅ | ✅ |
| .scd help | ✅ | ✅ (side-by-side) |
| Context menu | ✅ | ⚠️ (command palette) |
| Symbol detection | ✅ | ✅ |

## Advanced Features

### Side-by-Side Viewing

When opening `.scd` help files, they open in a separate editor column so you can:
- View help while writing code
- Copy examples from help files
- Reference documentation easily

### Timeout Protection

If `sclang` takes too long to respond (>5 seconds), the extension:
- Cancels the local search
- Falls back to online documentation
- Doesn't block your workflow

### Error Handling

The help system gracefully handles:
- ❌ SuperCollider not installed → Opens online docs
- ❌ Help file not found → Opens online docs
- ❌ Invalid symbol → Shows warning message
- ❌ Network issues → Shows appropriate error

## Keyboard Shortcut

Default binding: `Cmd+D` (Mac) / `Ctrl+D` (Windows/Linux)

This matches:
- **scide** default binding
- **scvim** default binding
- Standard SuperCollider convention

### Customizing the Shortcut

Add to your `keybindings.json`:

```json
{
    "key": "f1",  // Or any key you prefer
    "command": "supercollider.openHelp",
    "when": "editorTextFocus && editorLangId == supercollider"
}
```

## Command Palette

You can also access help via Command Palette:

1. Press `Cmd+Shift+P` (Mac) or `Ctrl+Shift+P` (Windows/Linux)
2. Type "SuperCollider: Open Help"
3. Press Enter

## Examples

### Example 1: Learning UGens

```supercollider
// Explore oscillators
SinOsc    // Cmd+D → Learn about sine oscillator
Saw       // Cmd+D → Learn about saw oscillator
Pulse     // Cmd+D → Learn about pulse oscillator
LFNoise0  // Cmd+D → Learn about noise generator
```

### Example 2: Understanding Classes

```supercollider
// Server architecture
Server     // Cmd+D → Server class
ServerOptions  // Cmd+D → Options
Bus        // Cmd+D → Bus system
Group      // Cmd+D → Node groups
```

### Example 3: Pattern System

```supercollider
(
Pbind(      // Cmd+D on Pbind
    \instrument, \default,
    \freq, Pseq([440, 550, 660], inf),  // Cmd+D on Pseq
    \dur, Prand([0.25, 0.5], inf)       // Cmd+D on Prand
).play;
)
```

### Example 4: GUI Programming

```supercollider
(
Window.new("Test").front;  // Cmd+D on Window
Button.new              // Cmd+D on Button
Slider.new              // Cmd+D on Slider
)
```

## Tips

### 💡 Quick Learning Workflow

1. Write code
2. Cmd+D on unfamiliar symbols
3. Read help documentation
4. Copy examples
5. Experiment!

### 💡 Browse Related Help

Many help files include links to related topics. Follow these links to explore:
- Similar classes
- Related tutorials
- Usage examples

### 💡 Keep Help Open

Use VS Code's split view to keep help documentation open while coding:
1. Cmd+D to open help
2. Help opens in side panel
3. Continue coding in main editor

## Troubleshooting

### Help Opens in Browser Instead of Locally

**Cause**: SuperCollider not found or not properly configured

**Solution**:
1. Install SuperCollider from https://supercollider.github.io/
2. Configure `supercollider.sclangPath` in settings
3. Verify: Run `sclang -v` in terminal

### "No symbol under cursor" Warning

**Cause**: Cursor is on whitespace or non-symbol character

**Solution**: Place cursor directly on a word/symbol

### Help File Not Found

**Cause**: Symbol might not have help documentation

**Solution**: Extension automatically opens online docs as fallback

### Timeout Errors

**Cause**: sclang taking too long to start

**Solution**:
- Check sclang installation
- Extension automatically falls back to online help
- Consider using online help as primary (no delay)

## Implementation Details

The help system works in three stages:

1. **Symbol Extraction**
   - Uses VS Code's `getWordRangeAtPosition()`
   - Extracts clean symbol name

2. **Local Search**
   - Spawns `sclang` with `-e` (evaluate) flag
   - Runs SuperCollider code to find help file path
   - Parses output for file path

3. **File Opening**
   - HTML → Opens in default browser
   - .scd → Opens in VS Code (side-by-side)
   - Other → Opens in VS Code as text

4. **Fallback**
   - If any step fails → Opens online documentation
   - User sees seamless experience

## Future Enhancements

Potential improvements:
- [ ] Hover tooltips with brief help
- [ ] Auto-complete with help snippets
- [ ] Search help database
- [ ] Browse help tree
- [ ] Offline help viewer (HTML in VS Code)

---

**Now you have full access to SuperCollider's extensive help system right in VS Code! 📚**

