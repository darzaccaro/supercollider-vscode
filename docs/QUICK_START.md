# Quick Start Guide

## How It Works

This extension connects to your **existing SuperCollider IDE** (scide) via OSC. It doesn't start its own sclang process - it just sends code to the scide you already have running.

## Setup (One Time)

### 1. Start SuperCollider IDE (scide)

Open scide as you normally would.

### 2. Enable OSC in scide

In scide, evaluate this once:

```supercollider
// Enable OSC communication (default port 57120)
thisProcess.openUDPPort(57120);
```

**Or** add this to your startup file (`~/Library/Application Support/SuperCollider/startup.scd` on Mac):

```supercollider
// Auto-enable OSC on startup
thisProcess.openUDPPort(57120);
```

### 3. Done!

The extension will auto-connect when you open Cursor/VS Code.

## Usage

### 1. Open a `.sc` or `.scd` file

### 2. Evaluate code

- **`Cmd+Enter`** (Mac) / **`Ctrl+Enter`** (Windows/Linux) - Evaluate selection or current line
- **If no selection**: Evaluates the entire parenthesized block `(...)` if cursor is inside one
- **If selection**: Evaluates selected code

```supercollider
// Evaluate this line
"Hello World".postln;

// Or evaluate this entire block (place cursor anywhere inside)
(
    var synth = {
        SinOsc.ar(440, 0, 0.2) ! 2
    }.play;
    
    synth;
)
```

### 3. Stop all sounds

- **`Cmd+.`** (Mac) / **`Ctrl+.`** (Windows/Linux)

### 4. Open help

- Place cursor on a class/method
- **`Cmd+D`** (Mac) / **`Ctrl+D`** (Windows/Linux)
- Opens local help or falls back to online docs

## Status Bar

Look at the bottom right corner:

- **`SC ●`** - Connected to scide
- **`SC ○`** - Not connected (start scide first!)

Click the status to manually connect.

## Commands

Open Command Palette (`Cmd+Shift+P` / `Ctrl+Shift+P`):

- **SuperCollider: Connect OSC** - Manual connection
- **SuperCollider: Boot Server** - Boot audio server (`s.boot`)
- **SuperCollider: Quit Server** - Quit audio server (`s.quit`)
- **SuperCollider: Stop All Sounds** - Emergency stop (`Cmd+.`)
- **SuperCollider: Open Help** - Help for symbol at cursor (`Cmd+D`)

## Where Output Goes

All output (postln, errors, etc.) appears in **scide's post window**, not in Cursor!

This is by design - use scide for monitoring output, Cursor for editing code.

## Workflow Example

1. **Start scide** (once)
2. **In scide**: `thisProcess.openUDPPort(57120);`
3. **In scide**: `s.boot;` (boot the audio server)
4. **In Cursor**: Open `.sc` file
5. **In Cursor**: Write and evaluate code with `Cmd+Enter`
6. **In scide**: See output in post window
7. **In scide**: Hear audio

## Troubleshooting

### "Not connected to SuperCollider"

**Fix**: Start scide and make sure OSC is enabled:
```supercollider
thisProcess.openUDPPort(57120);
```

### Code doesn't evaluate

**Check**:
1. Is scide running?
2. Did you enable OSC in scide?
3. Is the port correct? (default: 57120)

### Wrong port?

Change in settings:
1. `Cmd+,` → Search "SuperCollider"
2. Change "OSC Port" (default: 57120)
3. In scide: `thisProcess.openUDPPort(YOUR_PORT);`

### No audio

The server boots in scide, not the extension. In scide:
```supercollider
s.boot;
```

## Advanced: Using Without scide

If you don't want to use scide at all, the extension can start its own sclang process, but this is **not recommended** as you won't see output easily.

## Philosophy

This extension is designed to work **with** scide, not replace it:

- **Cursor/VS Code**: Better text editing, multiple cursors, git integration, modern IDE features
- **scide**: Post window, help browser, server monitoring, meters, scope

Best of both worlds! 🎵

