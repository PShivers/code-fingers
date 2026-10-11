// Web Audio API Synthesizer for mechanical keyboard typing sounds
class AudioEngine {
	constructor() {
		this.ctx = null;
	}

	init() {
		if (typeof window === "undefined") return;
		if (!this.ctx) {
			const AudioContextClass = window.AudioContext || window.webkitAudioContext;
			if (AudioContextClass) {
				this.ctx = new AudioContextClass();
			}
		}
		if (this.ctx && this.ctx.state === "suspended") {
			this.ctx.resume();
		}
	}

	playKey(type = "clicky", volume = 0.5) {
		if (type === "off" || !volume) return;
		this.init();
		if (!this.ctx) return;

		const t = this.ctx.currentTime;
		const gain = this.ctx.createGain();
		gain.connect(this.ctx.destination);

		if (type === "clicky") {
			// Sharp, crisp mechanical click (e.g. Cherry MX Blue)
			const osc1 = this.ctx.createOscillator();
			const osc2 = this.ctx.createOscillator();
			const filter = this.ctx.createBiquadFilter();

			filter.type = "bandpass";
			filter.frequency.setValueAtTime(3200, t);
			filter.Q.setValueAtTime(3.0, t);

			osc1.type = "triangle";
			osc1.frequency.setValueAtTime(2400, t);
			osc1.frequency.exponentialRampToValueAtTime(800, t + 0.025);

			osc2.type = "square";
			osc2.frequency.setValueAtTime(4200, t);
			osc2.frequency.exponentialRampToValueAtTime(1200, t + 0.015);

			gain.gain.setValueAtTime(0.001, t);
			gain.gain.linearRampToValueAtTime(volume * 0.45, t + 0.002);
			gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.035);

			osc1.connect(filter);
			osc2.connect(filter);
			filter.connect(gain);

			osc1.start(t);
			osc2.start(t);
			osc1.stop(t + 0.04);
			osc2.stop(t + 0.04);
		} else if (type === "thock") {
			// Deep, resonant, lubed mechanical thock (e.g. Gateron Ink Black)
			const osc = this.ctx.createOscillator();
			const filter = this.ctx.createBiquadFilter();

			filter.type = "lowpass";
			filter.frequency.setValueAtTime(550, t);

			osc.type = "sine";
			osc.frequency.setValueAtTime(220, t);
			osc.frequency.exponentialRampToValueAtTime(55, t + 0.045);

			gain.gain.setValueAtTime(0.001, t);
			gain.gain.linearRampToValueAtTime(volume * 0.7, t + 0.003);
			gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.05);

			osc.connect(filter);
			filter.connect(gain);

			osc.start(t);
			osc.stop(t + 0.055);
		} else if (type === "soft") {
			// Soft tactile bump
			const osc = this.ctx.createOscillator();
			osc.type = "triangle";
			osc.frequency.setValueAtTime(400, t);
			osc.frequency.exponentialRampToValueAtTime(140, t + 0.025);

			gain.gain.setValueAtTime(0.001, t);
			gain.gain.linearRampToValueAtTime(volume * 0.35, t + 0.002);
			gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.03);

			osc.connect(gain);
			osc.start(t);
			osc.stop(t + 0.035);
		}
	}

	playError(volume = 0.5) {
		if (!volume) return;
		this.init();
		if (!this.ctx) return;

		const t = this.ctx.currentTime;
		const osc = this.ctx.createOscillator();
		const gain = this.ctx.createGain();

		osc.type = "sawtooth";
		osc.frequency.setValueAtTime(150, t);
		osc.frequency.exponentialRampToValueAtTime(90, t + 0.07);

		gain.gain.setValueAtTime(0.001, t);
		gain.gain.linearRampToValueAtTime(volume * 0.25, t + 0.004);
		gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.08);

		osc.connect(gain);
		gain.connect(this.ctx.destination);

		osc.start(t);
		osc.stop(t + 0.085);
	}
}

export const soundEngine = new AudioEngine();
