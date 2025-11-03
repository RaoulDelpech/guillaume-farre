"use client";
import { useCallback, useEffect, useState } from "react";

// Sound effects using Web Audio API and data URIs for immediate playback
export function useSoundEffects() {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);

  useEffect(() => {
    // Initialize AudioContext on user interaction (browser requirement)
    if (typeof window !== "undefined" && !audioContext) {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      setAudioContext(ctx);
    }
  }, [audioContext]);

  // Play a beep sound with specific frequency and duration
  const playBeep = useCallback(
    (frequency: number, duration: number, volume: number = 0.3) => {
      if (!soundEnabled || !audioContext) return;

      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = frequency;
      oscillator.type = "sine";

      gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + duration
      );

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration);
    },
    [soundEnabled, audioContext]
  );

  // Success sound (upward sweep)
  const playSuccess = useCallback(() => {
    if (!soundEnabled || !audioContext) return;
    playBeep(523, 0.1, 0.2); // C5
    setTimeout(() => playBeep(659, 0.1, 0.2), 100); // E5
    setTimeout(() => playBeep(784, 0.15, 0.2), 200); // G5
  }, [soundEnabled, audioContext, playBeep]);

  // Error sound (downward)
  const playError = useCallback(() => {
    if (!soundEnabled || !audioContext) return;
    playBeep(400, 0.1, 0.2);
    setTimeout(() => playBeep(300, 0.15, 0.2), 100);
  }, [soundEnabled, audioContext, playBeep]);

  // Click sound
  const playClick = useCallback(() => {
    if (!soundEnabled || !audioContext) return;
    playBeep(800, 0.05, 0.15);
  }, [soundEnabled, audioContext, playBeep]);

  // Hover sound (subtle)
  const playHover = useCallback(() => {
    if (!soundEnabled || !audioContext) return;
    playBeep(600, 0.03, 0.08);
  }, [soundEnabled, audioContext, playBeep]);

  // Heart/favorite sound (cute upward chirp)
  const playHeart = useCallback(() => {
    if (!soundEnabled || !audioContext) return;
    playBeep(800, 0.08, 0.15);
    setTimeout(() => playBeep(1000, 0.08, 0.15), 80);
  }, [soundEnabled, audioContext, playBeep]);

  // Cart add sound (cash register style)
  const playCartAdd = useCallback(() => {
    if (!soundEnabled || !audioContext) return;
    playBeep(659, 0.1, 0.2); // E5
    setTimeout(() => playBeep(784, 0.1, 0.2), 100); // G5
    setTimeout(() => playBeep(1047, 0.2, 0.25), 200); // C6
  }, [soundEnabled, audioContext, playBeep]);

  // Notification sound
  const playNotification = useCallback(() => {
    if (!soundEnabled || !audioContext) return;
    playBeep(880, 0.1, 0.15); // A5
    setTimeout(() => playBeep(1175, 0.15, 0.15), 150); // D6
  }, [soundEnabled, audioContext, playBeep]);

  // Whoosh sound (for page transitions)
  const playWhoosh = useCallback(() => {
    if (!soundEnabled || !audioContext) return;

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.type = "sawtooth";
    oscillator.frequency.setValueAtTime(1200, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(
      200,
      audioContext.currentTime + 0.3
    );

    gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      audioContext.currentTime + 0.3
    );

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
  }, [soundEnabled, audioContext]);

  // Engine rev sound (Ferrari themed!)
  const playFerrariRev = useCallback(() => {
    if (!soundEnabled || !audioContext) return;

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.type = "sawtooth";
    oscillator.frequency.setValueAtTime(100, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(
      800,
      audioContext.currentTime + 0.4
    );
    oscillator.frequency.exponentialRampToValueAtTime(
      150,
      audioContext.currentTime + 0.7
    );

    gainNode.gain.setValueAtTime(0.15, audioContext.currentTime);
    gainNode.gain.setValueAtTime(0.15, audioContext.currentTime + 0.4);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      audioContext.currentTime + 0.7
    );

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.7);
  }, [soundEnabled, audioContext]);

  const toggleSound = useCallback(() => {
    setSoundEnabled((prev) => !prev);
  }, []);

  return {
    soundEnabled,
    toggleSound,
    playSuccess,
    playError,
    playClick,
    playHover,
    playHeart,
    playCartAdd,
    playNotification,
    playWhoosh,
    playFerrariRev,
  };
}
