"use client";
import { useSoundEffects } from "@/hooks/useSoundEffects";

export default function SoundToggle() {
  const { soundEnabled, toggleSound, playClick } = useSoundEffects();

  const handleToggle = () => {
    playClick();
    toggleSound();
  };

  return (
    <button
      onClick={handleToggle}
      className="fixed bottom-6 right-6 z-50 w-12 h-12 bg-background/80 backdrop-blur-sm hover:bg-muted text-foreground border border-border hover:border-foreground/50 rounded-full shadow-lg transition-all transform hover:scale-105 flex items-center justify-center group"
      title={soundEnabled ? "Désactiver les sons" : "Activer les sons"}
    >
      {soundEnabled ? (
        <span className="text-lg">🔊</span>
      ) : (
        <span className="text-lg">🔇</span>
      )}

      {/* Tooltip */}
      <div className="absolute bottom-full mb-2 right-0 bg-background/90 backdrop-blur-sm text-foreground text-xs px-3 py-2 border border-border whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        {soundEnabled ? "Désactiver les sons" : "Activer les sons"}
      </div>
    </button>
  );
}
