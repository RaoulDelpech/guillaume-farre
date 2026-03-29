"use client";

export function useConfetti() {
  // Confetti explosion basique
  const fireConfetti = async () => {
    const confetti = (await import("canvas-confetti")).default;
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#DC143C", "#FF0000", "#FFD700", "#FFA500", "#FFFFFF"],
    });
  };

  // Confetti latéral (pour ajout favoris)
  const fireSideConfetti = async () => {
    const confetti = (await import("canvas-confetti")).default;
    const end = Date.now() + 1000;

    (function frame() {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.6 },
        colors: ["#FF1744", "#F50057", "#E91E63"],
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.6 },
        colors: ["#FF1744", "#F50057", "#E91E63"],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  };

  // Confetti pluie (pour achat réussi)
  const fireRainConfetti = async () => {
    const confetti = (await import("canvas-confetti")).default;
    const duration = 2000;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ["#FFD700", "#FFA500", "#FF6347"],
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ["#FFD700", "#FFA500", "#FF6347"],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  };

  // Canon de confetti (pour succès majeur)
  const fireCannonConfetti = async () => {
    const confetti = (await import("canvas-confetti")).default;
    const count = 200;
    const defaults = {
      origin: { y: 0.7 },
    };

    function fire(particleRatio: number, opts: any) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
        colors: ["#DC143C", "#FF0000", "#FFD700", "#FFA500", "#FF1493"],
      });
    }

    fire(0.25, {
      spread: 26,
      startVelocity: 55,
    });

    fire(0.2, {
      spread: 60,
    });

    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
    });

    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
    });

    fire(0.1, {
      spread: 120,
      startVelocity: 45,
    });
  };

  // Confetti Ferrari (rouge et or)
  const fireFerrariConfetti = async () => {
    const confetti = (await import("canvas-confetti")).default;
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function () {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);

      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ["#DC143C", "#FF0000", "#8B0000"],
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ["#FFD700", "#FFA500", "#FF6347"],
      });
    }, 250);
  };

  // Coeurs (pour favoris)
  const fireHeartConfetti = async () => {
    const confetti = (await import("canvas-confetti")).default;
    const scalar = 2;
    const heart = confetti.shapeFromText({ text: "❤️", scalar });

    confetti({
      shapes: [heart],
      particleCount: 30,
      spread: 100,
      origin: { y: 0.6 },
      scalar,
    });
  };

  // Emoji Ferrari
  const fireFerrariEmojiConfetti = async () => {
    const confetti = (await import("canvas-confetti")).default;
    const scalar = 2;
    const ferrari = confetti.shapeFromText({ text: "🏎️", scalar });

    confetti({
      shapes: [ferrari],
      particleCount: 20,
      spread: 80,
      origin: { y: 0.6 },
      scalar,
    });
  };

  return {
    fireConfetti,
    fireSideConfetti,
    fireRainConfetti,
    fireCannonConfetti,
    fireFerrariConfetti,
    fireHeartConfetti,
    fireFerrariEmojiConfetti,
  };
}
