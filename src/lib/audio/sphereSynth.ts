/**
 * Procedural Web Audio synthesizer for tactile 3D physics sphere acoustics.
 * Generates glassy, ceramic, and damped studio impacts without external audio assets.
 */
class SphereAudioEngine {
  private ctx: AudioContext | null = null;
  private muted = false;
  private lastCollisionMs = 0;
  private lastHoverMs = 0;

  private ensureContext(): AudioContext | null {
    if (typeof window === 'undefined' || this.muted) return null;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return null;

    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return null;
      try {
        this.ctx = new AudioCtx();
      } catch {
        return null;
      }
    }

    if (this.ctx.state === 'suspended') {
      void this.ctx.resume().catch(() => undefined);
    }

    return this.ctx;
  }

  /**
   * Unlocks Web Audio on an explicit pointer/keyboard gesture.
   */
  unlock(): void {
    this.ensureContext();
  }

  isMuted(): boolean {
    return this.muted;
  }

  setMuted(nextMuted: boolean): void {
    this.muted = nextMuted;
    if (!nextMuted) {
      this.ensureContext();
    }
  }

  /**
   * Plays a damped physical billiard/glass collision sound scaled by velocity/variant.
   */
  playCollision(intensity = 0.5, variant: 'dark' | 'white' | 'accent' = 'white'): void {
    const ctx = this.ensureContext();
    if (!ctx || ctx.state !== 'running') return;

    const nowMs = performance.now();
    if (nowMs - this.lastCollisionMs < 48) return;
    this.lastCollisionMs = nowMs;

    const gainPeak = Math.min(0.18, Math.max(0.015, intensity * 0.08));
    if (gainPeak < 0.018) return;

    const now = ctx.currentTime;
    const baseFreq =
      variant === 'dark'
        ? 190 + Math.random() * 55
        : variant === 'accent'
          ? 520 + Math.random() * 140
          : 340 + Math.random() * 90;

    const osc = ctx.createOscillator();
    const harmonic = ctx.createOscillator();
    const env = ctx.createGain();
    const harmonicGain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(baseFreq * 1.18, now);
    osc.frequency.exponentialRampToValueAtTime(baseFreq, now + 0.035);

    harmonic.type = 'triangle';
    harmonic.frequency.setValueAtTime(baseFreq * 2.48, now);

    env.gain.setValueAtTime(0.0001, now);
    env.gain.linearRampToValueAtTime(gainPeak, now + 0.004);
    env.gain.exponentialRampToValueAtTime(0.0001, now + 0.14);

    harmonicGain.gain.setValueAtTime(gainPeak * 0.28, now);
    harmonicGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.045);

    osc.connect(env);
    harmonic.connect(harmonicGain);
    harmonicGain.connect(env);
    env.connect(ctx.destination);

    osc.start(now);
    harmonic.start(now);
    osc.stop(now + 0.16);
    harmonic.stop(now + 0.06);
  }

  /**
   * Plays a soft glassy harmonic shimmer when cursor interacts with a sphere.
   */
  playHoverPing(pitchOffset = 0): void {
    const ctx = this.ensureContext();
    if (!ctx || ctx.state !== 'running') return;

    const nowMs = performance.now();
    if (nowMs - this.lastHoverMs < 85) return;
    this.lastHoverMs = nowMs;

    const now = ctx.currentTime;
    const scale = [440, 493.88, 554.37, 659.25, 739.99, 880];
    const freq = scale[Math.abs(pitchOffset) % scale.length];

    const osc = ctx.createOscillator();
    const env = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.03, now + 0.08);

    env.gain.setValueAtTime(0.0001, now);
    env.gain.linearRampToValueAtTime(0.055, now + 0.012);
    env.gain.exponentialRampToValueAtTime(0.0001, now + 0.19);

    osc.connect(env);
    env.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.2);
  }

  /**
   * Plays a warm studio chord click when cycling the 3D sphere palette on click.
   */
  playAccentShift(accentIndex: number): void {
    const ctx = this.ensureContext();
    if (!ctx) return;

    const startNote = () => {
      if (ctx.state !== 'running') return;
      const roots = [392.0, 440.0, 493.88, 523.25];
      const root = roots[accentIndex % roots.length];
      const now = ctx.currentTime;

      [root, root * 1.25].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const env = ctx.createGain();
        osc.type = idx === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.025);

        env.gain.setValueAtTime(0.0001, now + idx * 0.025);
        env.gain.linearRampToValueAtTime(0.07 / (idx + 1), now + idx * 0.025 + 0.01);
        env.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.025 + 0.22);

        osc.connect(env);
        env.connect(ctx.destination);
        osc.start(now + idx * 0.025);
        osc.stop(now + idx * 0.025 + 0.24);
      });
    };

    if (ctx.state === 'suspended') {
      void ctx.resume().then(startNote).catch(() => undefined);
    } else {
      startNote();
    }
  }

  /**
   * Plays a crisp kinetic scatter resonance for mobile/tablet tap dispersion.
   */
  playScatterPulse(): void {
    const ctx = this.ensureContext();
    if (!ctx) return;

    const trigger = () => {
      if (ctx.state !== 'running') return;
      const now = ctx.currentTime;
      [293.66, 440, 587.33].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const env = ctx.createGain();
        osc.type = idx === 0 ? 'triangle' : 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.018);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.12, now + idx * 0.018 + 0.14);

        env.gain.setValueAtTime(0.0001, now + idx * 0.018);
        env.gain.linearRampToValueAtTime(0.05 / (idx + 1), now + idx * 0.018 + 0.01);
        env.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.018 + 0.22);

        osc.connect(env);
        env.connect(ctx.destination);
        osc.start(now + idx * 0.018);
        osc.stop(now + idx * 0.018 + 0.24);
      });
    };

    if (ctx.state === 'suspended') {
      void ctx.resume().then(trigger).catch(() => undefined);
    } else {
      trigger();
    }
  }

  /**
   * Plays a Netflix-"tudum"-inspired dual sub-bass percussive signature + warm studio harmonic chord.
   * Returns true if the AudioContext is unlocked & running, false if blocked by browser autoplay policy.
   */
  playStartupSignature(): boolean {
    const ctx = this.ensureContext();
    if (!ctx) return false;

    const trigger = () => {
      if (ctx.state !== 'running') return;
      const now = ctx.currentTime;

      // Dual low-end percussive hits ("tu-dum" cadence)
      const beats = [
        { offset: 0, startFreq: 96, endFreq: 48, peak: 0.22, dur: 0.22 },
        { offset: 0.18, startFreq: 124, endFreq: 44, peak: 0.34, dur: 0.62 },
      ];

      for (const beat of beats) {
        const osc = ctx.createOscillator();
        const env = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(beat.startFreq, now + beat.offset);
        osc.frequency.exponentialRampToValueAtTime(beat.endFreq, now + beat.offset + beat.dur);

        env.gain.setValueAtTime(0.0001, now + beat.offset);
        env.gain.linearRampToValueAtTime(beat.peak, now + beat.offset + 0.012);
        env.gain.exponentialRampToValueAtTime(0.0001, now + beat.offset + beat.dur);

        osc.connect(env);
        env.connect(ctx.destination);
        osc.start(now + beat.offset);
        osc.stop(now + beat.offset + beat.dur + 0.04);
      }

      // Lush warm studio major-9th swell synced on the second beat
      const chord = [261.63, 329.63, 392.0, 587.33];
      chord.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const env = ctx.createGain();
        osc.type = idx % 2 === 0 ? 'triangle' : 'sine';
        osc.frequency.setValueAtTime(freq, now + 0.18);

        env.gain.setValueAtTime(0.0001, now + 0.18);
        env.gain.linearRampToValueAtTime(0.032 / (idx * 0.45 + 1), now + 0.28);
        env.gain.exponentialRampToValueAtTime(0.0001, now + 1.25);

        osc.connect(env);
        env.connect(ctx.destination);
        osc.start(now + 0.18);
        osc.stop(now + 1.3);
      });
    };

    if (ctx.state === 'running') {
      trigger();
      return true;
    }

    void ctx.resume().then(trigger).catch(() => undefined);
    return false;
  }
}

export const sphereSynth = new SphereAudioEngine();

