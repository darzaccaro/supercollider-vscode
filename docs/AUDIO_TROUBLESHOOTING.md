# Audio Troubleshooting Guide

## No Sound When Evaluating Code

If you're not hearing sound when evaluating SuperCollider code, follow these steps:

### Quick Check: Is the Server Booted?

Look at the **SuperCollider output panel** (at the bottom of the editor):

**You should see:**
```
Starting SuperCollider (sclang)...
sclang started successfully
Booting audio server...

booting server 'localhost' on address: 127.0.0.1:57110
Found 0 LADSPA plugins
Number of Devices: 2
   0 : "Built-in Output"
   1 : "Built-in Microphone"

"Built-in Output" Input Device
   Streams: 0
   
"Built-in Output" Output Device
   Streams: 1
      0  channels 2

SC_AudioDriver: sample rate = 44100.000000, driver's block size = 512
SuperCollider 3 server ready.
```

**If you see this**, the server is booted! ✅

### Step 1: Manually Boot the Server

If you don't see the server boot message, manually boot it:

**Option 1: Use Command**
1. Open Command Palette (`Cmd+Shift+P` / `Ctrl+Shift+P`)
2. Type: "SuperCollider: Boot Server"
3. Press Enter

**Option 2: Evaluate Boot Code**
```supercollider
Server.default.boot;
```
Press `Cmd+Enter` / `Ctrl+Enter`

**Wait for the "SuperCollider 3 server ready" message!**

### Step 2: Test with Simple Sound

Try this simple test:
```supercollider
{ SinOsc.ar(440) ! 2 * 0.2 }.play;
```

**You should hear a 440Hz sine wave!**

Stop it with:
- `Cmd+.` / `Ctrl+.`
- Or: `s.freeAll;`

### Step 3: Check Server Status

Evaluate this to check server status:
```supercollider
Server.default.serverRunning;
```

**Should show:** `true` or `-> true`

Also try:
```supercollider
s.boot;  // Shorter version
s.queryAllNodes;  // See what's running
s.meter;  // Open level meter
```

## Common Issues

### Issue: "Server not running"

**Solution:** Boot the server first:
```supercollider
Server.default.boot;
```

Wait 2-3 seconds for the boot message.

### Issue: Code Evaluates but No Sound

**Possible causes:**

1. **Server not booted**
   ```supercollider
   s.boot;  // Boot it
   ```

2. **Volume too low**
   ```supercollider
   s.volume = 0;  // Current volume
   s.volume = -20;  // Set to -20 dB (reasonable level)
   ```

3. **Wrong audio device**
   ```supercollider
   // Check current device
   ServerOptions.devices;
   
   // Set device (macOS example)
   Server.default.options.outDevice = "Built-in Output";
   Server.default.reboot;
   ```

4. **Synth freed immediately**
   ```supercollider
   // Bad: plays then stops
   { SinOsc.ar(440) }.play;
   
   // Good: plays continuously
   { SinOsc.ar(440) ! 2 * 0.2 }.play;
   ```

### Issue: "scsynth not found"

**Solution:** SuperCollider not installed or not in PATH

**macOS:**
```bash
# Add to ~/.zshrc or ~/.bash_profile
export PATH="/Applications/SuperCollider.app/Contents/MacOS:$PATH"
```

**Linux:**
```bash
sudo apt install supercollider
```

**Windows:**
Install from https://supercollider.github.io/

### Issue: Server Boot Fails

**Check the output panel for errors:**

**"Failed to open UDP socket"**
- Another SuperCollider instance running
- Port 57110 already in use
- Solution: Quit other SC instances or change port

**"Jack driver not found"** (Linux)
- Install JACK: `sudo apt install jackd2`
- Or use ALSA backend

**"Audio device error"**
- Check system audio settings
- Try different audio device
- Restart computer (sometimes helps!)

## Testing Audio Setup

### Test 1: Sine Wave
```supercollider
{ SinOsc.ar(440, 0, 0.2) ! 2 }.play;
```
Should hear a tone.

### Test 2: White Noise
```supercollider
{ WhiteNoise.ar(0.1) ! 2 }.play;
```
Should hear static.

### Test 3: Sweep
```supercollider
{ SinOsc.ar(Line.kr(200, 2000, 2), 0, 0.2) ! 2 }.play;
```
Should hear pitch rising.

### Test 4: Server Meter
```supercollider
s.meter;
```
Opens a meter window - you should see levels when playing sound.

## Extension-Specific Issues

### Output Panel Shows Nothing

1. Check if "SuperCollider" is selected in the OUTPUT dropdown
2. Look at the bottom panel tabs: Terminal, Output, Problems, Debug Console
3. Click OUTPUT, then select "SuperCollider" from dropdown

### Code Flash but No Output

**Check:**
1. Is sclang actually running?
   ```supercollider
   "test".postln;  // Should see "test" in output
   ```

2. Is server booted?
   ```supercollider
   s.serverRunning;  // Should return true
   ```

3. Any errors in output panel?
   Look for "ERROR:" messages

### Server Boots but Immediate Error

**"FAILURE /d_recv SynthDef not found"**
- Probably trying to use undefined SynthDef
- Define it first with `.add`

**"Audio device not available"**
- Check system audio settings
- Try: `s.options.device = "Built-in Output"; s.reboot;`

## Platform-Specific

### macOS

**Allow microphone access** (if needed):
- System Preferences → Security & Privacy → Privacy → Microphone
- Enable for SuperCollider or Cursor

**Multiple audio devices**:
```supercollider
ServerOptions.devices;  // List all
s.options.device = "Built-in Output";
s.reboot;
```

### Linux

**ALSA vs JACK**:
```supercollider
// Use ALSA (simpler)
Server.default.options.device = "hw:0";

// Or use JACK (more powerful)
// Start jackd first, then:
Server.default.options.device = nil;  // Uses JACK
```

### Windows

**ASIO drivers** (recommended):
1. Install ASIO4ALL from http://asio4all.org/
2. Configure in SuperCollider
3. Reboot server

## Debugging Workflow

### 1. Check sclang
```supercollider
"sclang is working".postln;
```
See output in panel? ✅ sclang works

### 2. Check server
```supercollider
s.boot;
```
Wait for "SuperCollider 3 server ready" ✅ Server works

### 3. Check audio
```supercollider
{ SinOsc.ar(440) ! 2 * 0.2 }.play;
```
Hear tone? ✅ Audio works

### 4. Kill all sound (if too loud!)
```
Cmd+. / Ctrl+.
```
Or:
```supercollider
s.freeAll;
```

## Getting Help

### Check Server Status
```supercollider
s.serverRunning;  // true if running
s.numSynths;      // number of synths playing
s.queryAllNodes;  // detailed node tree
s.volume;         // current volume
s.options;        // server options
```

### Verbose Boot
```supercollider
s.options.verbosity = 2;  // More detailed messages
s.reboot;
```

### Look at Post Window Output

All messages appear in the SuperCollider output panel - check there first!

## Quick Fixes

### "I see code flash but hear nothing"
```supercollider
s.boot;  // Make sure server is booted
```

### "I hear sound but output panel is empty"
- Check OUTPUT tab at bottom
- Select "SuperCollider" from dropdown

### "Code doesn't evaluate"
- Check for syntax errors in output panel
- Try simpler code first: `"test".postln;`

### "Server won't boot"
- Quit any other SuperCollider instances
- Check audio device is available
- Restart the extension (Reload Window)

## Example Session

**Good workflow:**

```supercollider
// 1. Boot server (automatic now, but can do manually)
s.boot;

// 2. Wait for "SuperCollider 3 server ready"

// 3. Test audio
{ SinOsc.ar(440) ! 2 * 0.2 }.play;

// 4. Stop with Cmd+.

// 5. Make music!
(
{
    var sig = SinOsc.ar([440, 442]);
    sig * 0.2;
}.play;
)

// 6. Stop with Cmd+.
```

## Still Not Working?

1. **Check output panel** for error messages
2. **Try in scide** - does sound work there?
3. **Check system audio** - other apps work?
4. **Restart everything**:
   - Reload VS Code/Cursor window
   - Restart SuperCollider
   - Restart computer (last resort!)

---

**Most common fix: Just run `s.boot;` and wait a few seconds! 🎵**

