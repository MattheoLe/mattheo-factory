/**
 * Original intro "ident" sound, synthesized with the Web Audio API (no file,
 * no third-party sound). Timed on the intro animation (styles/catalogue.css):
 *   0.2 s  logotype appears   → soft low impact
 *   1.7 s  light ribbons      → rising shimmer (A major chord, opening filter)
 *   2.8 s  dive into the dot  → deep "boom" with a reverb tail
 * Returns a stop function.
 */
export function playIntroSound(): () => void {
  const AudioContextClass =
    window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioContextClass) return () => {};

  const ctx = new AudioContextClass();
  void ctx.resume();
  const t0 = ctx.currentTime + 0.05;

  const master = ctx.createGain();
  master.gain.value = 0.7;
  const compressor = ctx.createDynamicsCompressor();
  master.connect(compressor).connect(ctx.destination);

  // Simple generated reverb (decaying noise impulse).
  const reverb = ctx.createConvolver();
  const length = Math.floor(ctx.sampleRate * 2.6);
  const impulse = ctx.createBuffer(2, length, ctx.sampleRate);
  for (let channel = 0; channel < 2; channel++) {
    const data = impulse.getChannelData(channel);
    for (let i = 0; i < length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / length) ** 3;
  }
  reverb.buffer = impulse;
  const wet = ctx.createGain();
  wet.gain.value = 0.35;
  reverb.connect(wet).connect(master);

  const out = (node: AudioNode) => {
    node.connect(master);
    node.connect(reverb);
  };

  /** Pitch-dropping sine "kick". */
  const hit = (at: number, from: number, to: number, peak: number, decay: number) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(from, at);
    osc.frequency.exponentialRampToValueAtTime(to, at + decay * 0.6);
    gain.gain.setValueAtTime(0.0001, at);
    gain.gain.exponentialRampToValueAtTime(peak, at + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, at + decay);
    osc.connect(gain);
    out(gain);
    osc.start(at);
    osc.stop(at + decay + 0.05);
  };

  /** Short filtered noise burst for the attack texture. */
  const noise = (at: number, duration: number, peak: number, frequency: number) => {
    const buffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * duration), ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = frequency;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(peak, at);
    gain.gain.exponentialRampToValueAtTime(0.0001, at + duration);
    source.connect(filter).connect(gain);
    out(gain);
    source.start(at);
  };

  // 1. Logotype: soft low impact.
  hit(t0 + 0.2, 120, 48, 0.6, 1.4);
  noise(t0 + 0.2, 0.25, 0.25, 900);

  // 2. Ribbons: rising shimmer on an A major chord.
  const swellStart = t0 + 1.6;
  const swellEnd = t0 + 2.85;
  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.Q.value = 6;
  filter.frequency.setValueAtTime(300, swellStart);
  filter.frequency.exponentialRampToValueAtTime(7000, swellEnd);
  const swell = ctx.createGain();
  swell.gain.setValueAtTime(0.0001, swellStart);
  swell.gain.exponentialRampToValueAtTime(0.18, swellEnd - 0.1);
  swell.gain.exponentialRampToValueAtTime(0.0001, swellEnd + 0.9);
  filter.connect(swell);
  out(swell);
  [110, 164.81, 220, 277.18, 329.63, 440].forEach((frequency, index) => {
    [-6, 6].forEach((detune) => {
      const osc = ctx.createOscillator();
      osc.type = index < 2 ? "sawtooth" : "triangle";
      osc.frequency.value = frequency;
      osc.detune.value = detune;
      osc.connect(filter);
      osc.start(swellStart);
      osc.stop(swellEnd + 1);
    });
  });

  // 3. Dive into the orange dot: deep boom.
  hit(t0 + 2.85, 90, 32, 1, 2.4);
  hit(t0 + 2.85, 180, 60, 0.35, 0.6);
  noise(t0 + 2.85, 0.5, 0.35, 2500);

  let stopped = false;
  const closeTimer = window.setTimeout(() => void ctx.close(), 7000);
  return () => {
    if (stopped) return;
    stopped = true;
    window.clearTimeout(closeTimer);
    const now = ctx.currentTime;
    master.gain.cancelScheduledValues(now);
    master.gain.setValueAtTime(master.gain.value, now);
    master.gain.linearRampToValueAtTime(0, now + 0.3);
    window.setTimeout(() => void ctx.close(), 400);
  };
}
