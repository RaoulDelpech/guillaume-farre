"use client";
import SocialProofNotifications, { OnlineViewers } from "./SocialProofNotifications";
import SoundToggle from "./SoundToggle";
import { useEffect, useState } from "react";

export default function HomeClient() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      {/* Social Proof Notifications */}
      <SocialProofNotifications />

      {/* Online Viewers Badge (floating) */}
      <div className="fixed top-24 right-6 z-40 hidden lg:block">
        <OnlineViewers count={42} />
      </div>

      {/* Sound Toggle */}
      <SoundToggle />

      {/* Easter Egg: Konami Code */}
      <KonamiCode />
    </>
  );
}

// Composant Easter Egg avec Konami Code
function KonamiCode() {
  useEffect(() => {
    const konamiCode = [
      "ArrowUp",
      "ArrowUp",
      "ArrowDown",
      "ArrowDown",
      "ArrowLeft",
      "ArrowRight",
      "ArrowLeft",
      "ArrowRight",
      "b",
      "a",
    ];
    let konamiIndex = 0;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
          triggerSecretFeature();
          konamiIndex = 0;
        }
      } else {
        konamiIndex = 0;
      }
    };

    const triggerSecretFeature = () => {
      // Afficher un message secret
      const div = document.createElement("div");
      div.innerHTML = `
        <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: linear-gradient(135deg, #DC143C 0%, #FFD700 100%); padding: 40px; border-radius: 20px; z-index: 9999; text-align: center; box-shadow: 0 20px 60px rgba(0,0,0,0.5);">
          <div style="font-size: 60px; margin-bottom: 20px;">🏎️💨</div>
          <h2 style="color: white; font-size: 32px; font-weight: bold; margin-bottom: 10px;">Bravo ! Code secret activé !</h2>
          <p style="color: white; font-size: 18px; margin-bottom: 20px;">Vous avez débloqué un code promo exclusif :</p>
          <div style="background: white; color: #DC143C; padding: 15px 30px; border-radius: 10px; font-size: 24px; font-weight: bold; font-family: monospace; margin-bottom: 20px;">FERRARI20</div>
          <p style="color: white; font-size: 14px; margin-bottom: 20px;">-20% sur votre première œuvre 🎉</p>
          <button onclick="this.parentElement.remove()" style="background: white; color: #DC143C; border: none; padding: 12px 30px; border-radius: 8px; font-weight: bold; cursor: pointer; font-size: 16px;">Fermer</button>
        </div>
      `;
      document.body.appendChild(div);

      // Confetti explosion
      import("canvas-confetti").then((confetti) => {
        confetti.default({
          particleCount: 200,
          spread: 120,
          origin: { y: 0.6 },
          colors: ["#DC143C", "#FFD700", "#FF6347", "#FFA500"],
        });
      });

      // Supprimer automatiquement après 10 secondes
      setTimeout(() => {
        div.remove();
      }, 10000);
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return null;
}
