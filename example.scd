// Example SuperCollider file to test the extension
// Press Cmd+Enter (Mac) or Ctrl+Enter (Win/Linux) to evaluate code

// Boot the server
s.boot;

// Simple sine wave synth
(
SynthDef(\simpleSine, {
    arg freq = 440, amp = 0.3;
    var sig, env;
    env = EnvGen.kr(Env.perc(0.01, 1), doneAction: 2);
    sig = SinOsc.ar(freq) * env * amp;
    Out.ar(0, sig ! 2);
}).add;
)

// Play a note
Synth(\simpleSine, [\freq, 440]);

// Play multiple notes
(
[60, 64, 67, 72].midicps.do { |freq|
    Synth(\simpleSine, [\freq, freq, \amp, 0.2]);
    0.2.wait;
};
)

// Pattern example
(
Pbind(
    \instrument, \simpleSine,
    \freq, Pseq([440, 550, 660, 880], inf),
    \dur, Pseq([0.25, 0.25, 0.5], inf),
    \amp, 0.2
).play;
)

// Stop all sounds (Cmd+. or Ctrl+.)
s.freeAll;

// Quit the server
s.quit;

