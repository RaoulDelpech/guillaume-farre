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
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-2xl transition-all transform hover:scale-110 flex items-center justify-center group"
      title={soundEnabled ? "Désactiver les sons" : "Activer les sons"}
    >
      {soundEnabled ? (
        <span className="text-2xl">🔊</span>
      ) : (
        <span className="text-2xl">🔇</span>
      )}

      {/* Tooltip */}
      <div className="absolute bottom-full mb-2 right-0 bg-black/90 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        {soundEnabled ? "Désactiver les sons" : "Activer les sons"}
      </div>

      {/* Pulse animation when enabled */}
      {soundEnabled && (
        <span className="absolute inset-0 rounded-full bg-red-600 animate-ping opacity-20" />
      )}
    </button>
  );
}
