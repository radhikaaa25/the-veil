import { useState, useRef, useEffect, useCallback } from 'react';

/**
 * AmbientSound – Generates eerie atmospheric audio using the Web Audio API.
 * No external sound files needed.
 *
 * Creates layered drone tones with subtle modulation for a supernatural feel.
 */
export default function AmbientSound() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioCtxRef = useRef(null);
  const nodesRef = useRef([]);

  const startAudio = useCallback(() => {
    if (audioCtxRef.current) return;

    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    audioCtxRef.current = ctx;

    const masterGain = ctx.createGain();
    masterGain.gain.value = 0.08;
    masterGain.connect(ctx.destination);

    // Deep drone
    const drone1 = ctx.createOscillator();
    drone1.type = 'sine';
    drone1.frequency.value = 55; // A1
    const drone1Gain = ctx.createGain();
    drone1Gain.gain.value = 0.4;
    drone1.connect(drone1Gain);
    drone1Gain.connect(masterGain);
    drone1.start();

    // Higher eerie tone
    const drone2 = ctx.createOscillator();
    drone2.type = 'sine';
    drone2.frequency.value = 220; // A3
    const drone2Gain = ctx.createGain();
    drone2Gain.gain.value = 0.08;
    drone2.connect(drone2Gain);
    drone2Gain.connect(masterGain);
    drone2.start();

    // Sub bass
    const drone3 = ctx.createOscillator();
    drone3.type = 'sine';
    drone3.frequency.value = 36.7; // D1
    const drone3Gain = ctx.createGain();
    drone3Gain.gain.value = 0.25;
    drone3.connect(drone3Gain);
    drone3Gain.connect(masterGain);
    drone3.start();

    // LFO for tremolo on drone2
    const lfo = ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 0.3;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 0.04;
    lfo.connect(lfoGain);
    lfoGain.connect(drone2Gain.gain);
    lfo.start();

    // Very slow frequency modulation on drone1
    const lfo2 = ctx.createOscillator();
    lfo2.type = 'sine';
    lfo2.frequency.value = 0.05;
    const lfo2Gain = ctx.createGain();
    lfo2Gain.gain.value = 2;
    lfo2.connect(lfo2Gain);
    lfo2Gain.connect(drone1.frequency);
    lfo2.start();

    nodesRef.current = [drone1, drone2, drone3, lfo, lfo2];
    setIsPlaying(true);
  }, []);

  const stopAudio = useCallback(() => {
    nodesRef.current.forEach((node) => {
      try { node.stop(); } catch (e) { /* already stopped */ }
    });
    nodesRef.current = [];

    if (audioCtxRef.current) {
      audioCtxRef.current.close();
      audioCtxRef.current = null;
    }

    setIsPlaying(false);
  }, []);

  const toggleSound = useCallback(() => {
    if (isPlaying) {
      stopAudio();
    } else {
      startAudio();
    }
  }, [isPlaying, startAudio, stopAudio]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioCtxRef.current) {
        nodesRef.current.forEach((node) => {
          try { node.stop(); } catch (e) { /* */ }
        });
        audioCtxRef.current.close();
      }
    };
  }, []);

  return (
    <button
      className="sound-toggle"
      onClick={toggleSound}
      title={isPlaying ? 'Mute ambient sound' : 'Enable ambient sound'}
    >
      {isPlaying ? '♫ SOUND ON' : '♪ SOUND OFF'}
    </button>
  );
}
