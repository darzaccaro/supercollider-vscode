# Setup Guide

## Quick Setup (2 minutes)

### Step 1: Start SuperCollider IDE (scide)

Open scide as you normally would.

### Step 2: Run Setup Code

In scide, evaluate this code **once**:

```supercollider
(
// Open UDP port for receiving OSC messages
thisProcess.openUDPPort(57120);

// Create OSC responder to execute code sent from Cursor
OSCdef(\cursorExtension, { |msg|
    var code = msg[1].asString;
    code.interpret;
}, '/interpret');

"✓ Ready to receive code from Cursor!".postln;
)
```

**That's it!** You can now evaluate code from Cursor.

### Step 3: Test It

1. In Cursor, open a `.sc` or `.scd` file
2. Check the status bar (bottom right) - should show **`SC ●`**
3. Evaluate this:
   ```supercollider
   "Hello from Cursor!".postln;
   ```
4. Check scide's post window - you should see "Hello from Cursor!"

## Permanent Setup (Optional)

To make this work every time you start scide, add the setup code to your startup file:

**Mac**: `~/Library/Application Support/SuperCollider/startup.scd`  
**Windows**: `%APPDATA%\SuperCollider\startup.scd`  
**Linux**: `~/.config/SuperCollider/startup.scd`

Add this to the file:

```supercollider
// Enable Cursor extension
(
thisProcess.openUDPPort(57120);
OSCdef(\cursorExtension, { |msg|
    var code = msg[1].asString;
    code.interpret;
}, '/interpret');
"Cursor extension enabled".postln;
)
```

Now it will auto-enable every time you start scide!

## Troubleshooting

### Status bar shows `SC ○` (not connected)

**Fix**: Make sure you ran the setup code in scide (Step 2 above).

### Code evaluates but nothing happens

**Check**: 
1. Did you run the setup code in scide?
2. Is scide actually running?
3. Look at scide's post window - do you see "Hello from Cursor!"?

### "Port 57120 already in use"

Someone else is using that port. Use a different port:

**In scide:**
```supercollider
(
thisProcess.openUDPPort(57121);  // Different port
OSCdef(\cursorExtension, { |msg|
    var code = msg[1].asString;
    code.interpret;
}, '/interpret');
)
```

**In Cursor:**
1. Settings → Search "SuperCollider"
2. Change "OSC Port" to `57121`
3. Reload window

### Test OSC Connection

To verify OSC is working, run this in scide:

```supercollider
// Test if OSC port is open
NetAddr.langPort;  // Should show 57120

// Test if responder is registered
OSCdef.all;  // Should show \cursorExtension
```

## How It Works

1. **scide** opens UDP port 57120
2. **scide** sets up OSC responder listening on `/interpret`
3. **Cursor extension** connects to `127.0.0.1:57120`
4. When you press `Cmd+Enter` in Cursor:
   - Extension sends OSC message: `/interpret "your code"`
   - scide receives it and executes: `"your code".interpret`
   - Output appears in scide's post window

## Features

Once set up, you can:

✅ **Evaluate code**: `Cmd+Enter` / `Ctrl+Enter`  
✅ **Evaluate blocks**: Place cursor in `(...)` and press `Cmd+Enter`  
✅ **Stop sounds**: `Cmd+.` / `Ctrl+.`  
✅ **Open help**: Place cursor on symbol, press `Cmd+D` / `Ctrl+D`  
✅ **Syntax highlighting**: Automatic for `.sc` and `.scd` files

## Workflow

1. **Edit in Cursor** - Better editor, multiple cursors, git, etc.
2. **Monitor in scide** - See output, errors, server status
3. **Best of both worlds!** 🎵

## Advanced

### Custom OSC Port

Change the port if 57120 is in use:

```supercollider
// In scide - use port 57121
thisProcess.openUDPPort(57121);
```

Then in Cursor settings:
```json
{
  "supercollider.oscPort": 57121
}
```

### Multiple Computers

You can send code from Cursor on one computer to scide on another!

**On the scide computer:**
```supercollider
thisProcess.openUDPPort(57120);
// Note your IP address
NetAddr.myIP;
```

**In Cursor settings:**
```json
{
  "supercollider.oscHost": "192.168.1.x",  // scide computer's IP
  "supercollider.oscPort": 57120
}
```

### Debug OSC Messages

To see what messages Cursor is sending:

```supercollider
// In scide - monitor all OSC
OSCFunc.trace(true);  // Start monitoring
OSCFunc.trace(false); // Stop monitoring
```

## Need Help?

If setup isn't working:

1. **Restart scide** and run the setup code again
2. **Reload Cursor** (Cmd+R)
3. **Check the Debug Console** in Cursor (View → Debug Console)
4. **Look for errors** in scide's post window

---

**After setup, just start scide and you're ready to code!** 🎉

