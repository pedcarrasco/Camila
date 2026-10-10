// Audio helper using Web Audio API for guaranteed offline-capable, crisp interactive sounds
// and background romantic melody.

class AudioManager {
  private ctx: AudioContext | null = null;
  private musicAudio: HTMLAudioElement | null = null;
  private isSynthesizingMusic = false;
  private musicGainNode: GainNode | null = null;
  private musicIntervalId: number | null = null;
  private isMusicPlaying = false;
  private subscribers: ((isPlaying: boolean) => void)[] = [];

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  // Cute pop sound on button taps
  public playPop() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      const now = ctx.currentTime;
      osc.type = 'sine';
      
      // Pitch envelope: quick upward sweep then drops
      osc.frequency.setValueAtTime(450, now);
      osc.frequency.exponentialRampToValueAtTime(900, now + 0.04);
      osc.frequency.exponentialRampToValueAtTime(250, now + 0.12);

      // Volume envelope: crisp pop
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.2, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.14);
    } catch {
      // Audio errors safely caught
    }
  }

  // Sweet magical chime/fanfare on unlocking the surprise
  public playChime() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const notes = [523.25, 659.25, 783.99, 987.77, 1046.50, 1318.51]; // C5, E5, G5, B5, C6, E6
      const baseTime = ctx.currentTime;

      notes.forEach((freq, idx) => {
        const noteTime = baseTime + idx * 0.08;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, noteTime);

        // Gentle bell vibrato
        gain.gain.setValueAtTime(0.001, noteTime);
        gain.gain.linearRampToValueAtTime(0.18, noteTime + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, noteTime + 1.2);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(noteTime);
        osc.stop(noteTime + 1.25);
      });
    } catch {
      // Audio errors safely caught
    }
  }

  // Soft sparkle sound for interactions
  public playSparkle() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      for (let i = 0; i < 4; i++) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const t = now + i * 0.06;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(1200 + Math.random() * 800, t);

        gain.gain.setValueAtTime(0.001, t);
        gain.gain.linearRampToValueAtTime(0.08, t + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.35);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(t);
        osc.stop(t + 0.4);
      }
    } catch {
      // Audio errors safely caught
    }
  }

  // Soft blow sound for candles
  public playBlow() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.exponentialRampToValueAtTime(120, now + 0.4);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.15, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.45);

      setTimeout(() => {
        this.playSparkle();
      }, 350);
    } catch {
      // Audio errors safely caught
    }
  }

  // Subscribe to music state changes
  public subscribeToMusicState(callback: (isPlaying: boolean) => void) {
    this.subscribers.push(callback);
    callback(this.isMusicPlaying);
    return () => {
      this.subscribers = this.subscribers.filter((s) => s !== callback);
    };
  }

  private notifyMusicState(isPlaying: boolean) {
    this.isMusicPlaying = isPlaying;
    this.subscribers.forEach((cb) => cb(isPlaying));
  }

  public getIsPlaying(): boolean {
    return this.isMusicPlaying;
  }

  // Toggle background romantic melody
  public async toggleMusic(): Promise<boolean> {
    if (this.isMusicPlaying) {
      this.stopMusic();
      return false;
    } else {
      await this.startMusic();
      return true;
    }
  }

  public async startMusic() {
    // If audio element already exists and was paused
    if (!this.musicAudio) {
      this.musicAudio = new Audio('https://cdn.pixabay.com/download/audio/2022/05/16/audio_db6591201e.mp3?filename=romantic-piano-112199.mp3');
      this.musicAudio.loop = true;
      this.musicAudio.volume = 0.35;
      this.musicAudio.crossOrigin = 'anonymous';
    }

    try {
      await this.musicAudio.play();
      this.notifyMusicState(true);
    } catch {
      // If network audio fails or is blocked by CORS/sandbox, fallback to procedural Web Audio romantic music box
      this.startSynthesizedRomanticMelody();
      this.notifyMusicState(true);
    }
  }

  public stopMusic() {
    if (this.musicAudio) {
      this.musicAudio.pause();
    }
    this.stopSynthesizedRomanticMelody();
    this.notifyMusicState(false);
  }

  // Procedural romantic lullaby / music box chord progression
  // Plays a soothing progression: C - G - Am - F with gentle music box notes
  private startSynthesizedRomanticMelody() {
    if (this.isSynthesizingMusic) return;
    this.isSynthesizingMusic = true;

    const ctx = this.getContext();
    if (!ctx) return;

    // Chords and notes (frequencies in Hz)
    // C major (C4, E4, G4, B4, C5, D5, E5, G5)
    const melodyScale = [
      261.63, 329.63, 392.00, 493.88, 523.25, 587.33, 659.25, 783.99, 880.00
    ];

    let noteIndex = 0;
    const playNextNote = () => {
      if (!this.isSynthesizingMusic) return;
      try {
        const audioCtx = this.getContext();
        if (!audioCtx) return;

        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        // Music box bell-like sound
        osc.type = 'sine';
        const freq = melodyScale[noteIndex % melodyScale.length];
        // subtle variation
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

        const now = audioCtx.currentTime;
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.06, now + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start(now);
        osc.stop(now + 1.25);

        // Pattern sequencing
        const steps = [0, 2, 4, 6, 4, 2, 7, 5, 3, 1, 4, 2];
        noteIndex = (noteIndex + 1) % steps.length;
      } catch {
        // Safe catch
      }
    };

    playNextNote();
    this.musicIntervalId = window.setInterval(playNextNote, 600);
  }

  private stopSynthesizedRomanticMelody() {
    this.isSynthesizingMusic = false;
    if (this.musicIntervalId !== null) {
      clearInterval(this.musicIntervalId);
      this.musicIntervalId = null;
    }
  }
}

export const audio = new AudioManager();
