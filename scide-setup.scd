/*
 * SuperCollider IDE Setup for Cursor/VS Code Extension
 * 
 * Run this code ONCE in scide to enable OSC communication
 * with the Cursor extension.
 * 
 * For permanent setup, add this to your startup file:
 * ~/Library/Application Support/SuperCollider/startup.scd (Mac)
 * %APPDATA%\SuperCollider\startup.scd (Windows)
 */

(
// Open UDP port for receiving OSC messages
thisProcess.openUDPPort(57120);

"Setting up OSC responder for Cursor extension...".postln;

// Remove any existing responder with this name
OSCdef(\cursorExtension).free;

// Create OSC responder to execute code sent from Cursor
OSCdef(\cursorExtension, { |msg, time, addr, recvPort|
    var code = msg[1].asString;
    
    ("Received from Cursor: " ++ code).postln;
    
    // Execute the code
    code.interpret;
    
}, '/interpret');

"OSC responder installed on port 57120".postln;
"Ready to receive code from Cursor extension!".postln;
"".postln;
"Status:".postln;
"  - Port: 57120".postln;
"  - OSC Path: /interpret".postln;
"  - Ready: YES".postln;
)

