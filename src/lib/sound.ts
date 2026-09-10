/**
 * Attractive, uplifting payment confirmation chime and tactile micro-sounds
 * synthesized via Web Audio API.
 * Zero external audio files required.
 * Fails silently if blocked by browser policy without affecting application flow.
 */

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  try {
    if (typeof window === 'undefined') return null;
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return null;
    if (!audioCtx || audioCtx.state === 'closed') {
      audioCtx = new AudioContextClass();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  } catch {
    return null;
  }
}

let isMuted = false;

export function isSoundMuted(): boolean {
  return isMuted;
}

export function setSoundMuted(muted: boolean): void {
  isMuted = muted;
}

export function toggleSound(): boolean {
  isMuted = !isMuted;
  return isMuted;
}

/**
 * Plays an attractive, uplifting luxury payment chime:
 * 1. Warm sub-bass tactile thud (creates physical presence like Apple Pay)
 * 2. Ascending 4-note E-Major arpeggio (E5 -> G#5 -> B5 -> E6)
 * 3. High crystal bell sparkle harmonic (2637 Hz)
 */
export function playSuccessSound(): void {
  if (isMuted) return;

  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // 1. Tactile Sub-Bass Thump (gives physical, satisfying weight)
    const subOsc = ctx.createOscillator();
    const subGain = ctx.createGain();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(115, now);
    subOsc.frequency.exponentialRampToValueAtTime(50, now + 0.12);
    subGain.gain.setValueAtTime(0.18, now);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
    subOsc.connect(subGain);
    subGain.connect(ctx.destination);
    subOsc.start(now);
    subOsc.stop(now + 0.12);

    // 2. Triumphant Ascending Chord Notes (E Major - cheerful, luxurious, uplifting)
    const chordNotes = [
      { freq: 659.25, time: 0.00, dur: 0.35, gain: 0.16 }, // E5
      { freq: 830.61, time: 0.07, dur: 0.40, gain: 0.18 }, // G#5
      { freq: 987.77, time: 0.14, dur: 0.48, gain: 0.22 }, // B5
      { freq: 1318.51, time: 0.21, dur: 0.70, gain: 0.26 }, // E6 (Climax Chime)
    ];

    chordNotes.forEach(({ freq, time, dur, gain: vol }) => {
      const startTime = now + time;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(vol, startTime + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + dur);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + dur);
    });

    // 3. Crystal Shimmer Bell Sparkle (Overtone)
    const sparkleOsc = ctx.createOscillator();
    const sparkleGain = ctx.createGain();
    sparkleOsc.type = 'sine';
    sparkleOsc.frequency.setValueAtTime(2637, now + 0.22); // E7
    sparkleGain.gain.setValueAtTime(0, now + 0.22);
    sparkleGain.gain.linearRampToValueAtTime(0.08, now + 0.24);
    sparkleGain.gain.exponentialRampToValueAtTime(0.001, now + 0.75);
    sparkleOsc.connect(sparkleGain);
    sparkleGain.connect(ctx.destination);
    sparkleOsc.start(now + 0.22);
    sparkleOsc.stop(now + 0.75);
  } catch (error) {
    console.warn('Audio playback not permitted or unavailable:', error);
  }
}

/**
 * Light, satisfying pop sound for steppers and micro-interactions
 */
export function playPopSound(): void {
  if (isMuted) return;

  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(460, now);
    osc.frequency.exponentialRampToValueAtTime(920, now + 0.04);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.04);
  } catch {
    // Silent
  }
}

/**
 * Soft, tactile descending bubble drop sound for decrements
 */
export function playDecrementSound(): void {
  if (isMuted) return;

  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(560, now);
    osc.frequency.exponentialRampToValueAtTime(280, now + 0.05);

    gain.gain.setValueAtTime(0.09, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.05);
  } catch {
    // Silent
  }
}
