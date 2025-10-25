// SuperCollider test file
// This file is used for testing the extension

// Simple variable assignment
~testVar = 42;

// Function definition
~testFunc = { |a, b|
    var result;
    result = a + b;
    result;
};

// Simple synth definition
SynthDef(\testSynth, {
    var sig, env;
    env = EnvGen.kr(Env.perc, doneAction: 2);
    sig = SinOsc.ar(440) * env * 0.3;
    Out.ar(0, sig ! 2);
}).add;

// Pattern example
(
Pbind(
    \instrument, \testSynth,
    \dur, 0.5,
    \amp, 0.2
).play;
)

// Array operations
~arr = [1, 2, 3, 4, 5];
~arr.do({ |item| item.postln; });

// Conditional
if(~testVar > 40, {
    "Test passed".postln;
}, {
    "Test failed".postln;
});

