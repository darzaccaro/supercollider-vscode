# Language Server Protocol Setup (Optional)

## What is the Language Server?

The SuperCollider Language Server Protocol (LSP) provides advanced IDE features:
- 📝 Auto-completion
- 📚 Hover documentation
- 🔍 Go to definition
- ⚠️ Real-time error checking
- 💡 Code hints

**This is completely optional!** The extension works great without it.

## The Error You Might See

```
Error: connect ECONNREFUSED 127.0.0.1:57121
```

**This is normal!** It just means LSP features aren't available. Everything else still works:
- ✅ Code evaluation
- ✅ Syntax highlighting
- ✅ Server control
- ✅ Help system
- ✅ Block evaluation

## Option 1: Disable LSP (Recommended if you don't need it)

Turn off the error message by disabling LSP:

1. Open VS Code/Cursor settings (`Cmd+,` / `Ctrl+,`)
2. Search for "SuperCollider"
3. **Uncheck** `SuperCollider: Use Language Server`

Or add to your `settings.json`:
```json
{
  "supercollider.useLanguageServer": false
}
```

The error will disappear and everything still works perfectly!

## Option 2: Enable LSP (If you want advanced features)

### Step 1: Install the LanguageServer Quark

In SuperCollider (scide or sclang):

```supercollider
// Install the quark
Quarks.install("LanguageServer");

// Recompile class library
thisProcess.recompile;
```

### Step 2: Start the Language Server

In SuperCollider:

```supercollider
// Start on default port (57121)
LanguageServer.start;

// Or specify a custom port
LanguageServer.start(57121);
```

### Step 3: Verify Connection

You should see in VS Code console:
```
SuperCollider Language Server started
```

### Step 4: Enjoy LSP Features!

Now you have:
- Auto-completion as you type
- Hover over symbols for documentation
- Error checking
- And more!

## Configuration

### Change LSP Port

If you need to use a different port:

1. Settings → `SuperCollider: Language Server Port` → Change from 57121
2. In SuperCollider: `LanguageServer.start(YOUR_PORT);`

### Auto-Start LSP

To automatically start LSP when sclang starts, add to your sclang startup file:

**~/.config/SuperCollider/startup.scd** (Linux/Mac)  
**%APPDATA%\SuperCollider\startup.scd** (Windows)

```supercollider
// Auto-start Language Server
LanguageServer.start(57121);
```

## Troubleshooting

### Still Getting Connection Error

1. **Check if LanguageServer Quark is installed:**
   ```supercollider
   Quarks.installed;  // Look for "LanguageServer"
   ```

2. **Check if sclang is running:**
   ```bash
   ps aux | grep sclang
   ```

3. **Check if Language Server is running:**
   ```supercollider
   LanguageServer.running;  // Should return true
   ```

4. **Restart Language Server:**
   ```supercollider
   LanguageServer.stop;
   LanguageServer.start;
   ```

### Port Already in Use

```
Error: Port 57121 already in use
```

**Solution:** Use a different port:
```supercollider
// In SuperCollider
LanguageServer.start(57122);
```

```json
// In VS Code settings
{
  "supercollider.languageServerPort": 57122
}
```

### No Auto-Completion

**Check:**
1. Is LSP enabled in settings?
2. Is LanguageServer running in sclang?
3. Is file saved with `.sc` or `.scd` extension?
4. Try reloading VS Code window

## Comparison: With vs Without LSP

### Without LSP (Default)
✅ Syntax highlighting  
✅ Code evaluation  
✅ Server control  
✅ Help system (Cmd+D)  
✅ Block evaluation  
❌ Auto-completion  
❌ Hover docs  
❌ Go to definition  
❌ Real-time errors  

### With LSP
✅ Everything above PLUS:  
✅ Auto-completion  
✅ Hover docs  
✅ Go to definition  
✅ Real-time error checking  
✅ Code hints  

## Recommendation

### For Beginners
**Disable LSP** - One less thing to worry about. The extension works great without it!

```json
{
  "supercollider.useLanguageServer": false
}
```

### For Advanced Users
**Enable LSP** - Get IDE-level features:

1. Install LanguageServer Quark
2. Start: `LanguageServer.start;`
3. Enjoy enhanced coding experience

## Alternative: Use Without LSP

You already have great features without LSP:

### Help System (Cmd+D)
Instead of hover docs, use `Cmd+D` on any symbol:
```supercollider
SinOsc  // Place cursor here, press Cmd+D
```
Opens full documentation instantly!

### Manual Auto-Completion
Use SuperCollider's built-in help and examples:
- Browse class library
- Check help files
- Use sccode.org examples

### Direct Evaluation
Best feature - direct feedback:
```supercollider
// Just evaluate and see results!
(1..10).postln;
```

## Summary

**Quick Fix (Recommended for most users):**

Settings → Search "SuperCollider" → Uncheck "Use Language Server"

**Or just ignore the error** - it doesn't affect functionality!

**Advanced Setup (Optional):**

```supercollider
// In SuperCollider
Quarks.install("LanguageServer");
LanguageServer.start;
```

---

**The extension works perfectly either way! Choose what works for you. 🎵**

