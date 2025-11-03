"use client";
import { useEffect, useState } from "react";
import { Link } from "@/i18n/routing";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function PerformanceCountdown() {
  // Next performance date (example: 30 days from now)
  const [targetDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() + 30); // 30 days from now
    date.setHours(19, 0, 0, 0); // 19:00
    return date;
  });

  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const calculateTimeLeft = () => {
      const difference = targetDate.getTime() - new Date().getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (!mounted) return null;

  const formatDate = () => {
    return targetDate.toLocaleDateString("fr-FR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="bg-gradient-to-r from-red-950/30 via-orange-950/30 to-red-950/30 border-2 border-red-600/40 rounded-2xl p-6 md:p-8 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-r from-red-600/10 to-orange-600/10 animate-pulse" />

      <div className="relative z-10">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-block px-4 py-2 bg-red-600 rounded-full text-sm font-bold mb-3 animate-pulse">
            🔴 PERFORMANCE LIVE EN DIRECT
          </div>
          <h3 className="text-2xl md:text-3xl font-bold mb-2">
            Prochaine création en direct
          </h3>
          <p className="text-gray-400 text-sm mb-1">
            📅 {formatDate()}
          </p>
          <p className="text-gray-400 text-xs">
            📍 Circuit Paul Ricard, Le Castellet
          </p>
        </div>

        {/* Countdown */}
        <div className="grid grid-cols-4 gap-3 md:gap-4 mb-6">
          <div className="bg-black/40 border border-red-600/30 rounded-xl p-3 md:p-4 text-center">
            <div className="text-3xl md:text-4xl font-bold text-red-500 mb-1">
              {String(timeLeft.days).padStart(2, "0")}
            </div>
            <div className="text-xs md:text-sm text-gray-400">Jours</div>
          </div>
          <div className="bg-black/40 border border-red-600/30 rounded-xl p-3 md:p-4 text-center">
            <div className="text-3xl md:text-4xl font-bold text-red-500 mb-1">
              {String(timeLeft.hours).padStart(2, "0")}
            </div>
            <div className="text-xs md:text-sm text-gray-400">Heures</div>
          </div>
          <div className="bg-black/40 border border-red-600/30 rounded-xl p-3 md:p-4 text-center">
            <div className="text-3xl md:text-4xl font-bold text-red-500 mb-1">
              {String(timeLeft.minutes).padStart(2, "0")}
            </div>
            <div className="text-xs md:text-sm text-gray-400">Minutes</div>
          </div>
          <div className="bg-black/40 border border-red-600/30 rounded-xl p-3 md:p-4 text-center">
            <div className="text-3xl md:text-4xl font-bold text-red-500 mb-1 animate-pulse">
              {String(timeLeft.seconds).padStart(2, "0")}
            </div>
            <div className="text-xs md:text-sm text-gray-400">Secondes</div>
          </div>
        </div>

        {/* Details */}
        <div className="bg-black/30 border border-white/10 rounded-xl p-4 mb-4">
          <h4 className="font-bold mb-2 text-sm md:text-base">
            🎨 Ce qui vous attend :
          </h4>
          <ul className="space-y-2 text-sm text-gray-300">
            <li className="flex items-start gap-2">
              <span className="text-red-500 mt-0.5">🏎️</span>
              <span>Performance live avec la Ferrari 458 Italia</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 mt-0.5">🎥</span>
              <span>Diffusion en direct sur nos réseaux sociaux</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 mt-0.5">🖼️</span>
              <span>Création de 3 œuvres uniques en édition limitée</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 mt-0.5">🎫</span>
              <span>Possibilité de réserver votre œuvre en avant-première</span>
            </li>
          </ul>
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/performances"
            className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-center transition-all transform hover:scale-105"
          >
            📺 Être notifié(e)
          </Link>
          <Link
            href="/contact"
            className="flex-1 px-6 py-3 bg-white/10 hover:bg-white/20 border-2 border-white/30 text-white font-bold rounded-lg text-center transition-all"
          >
            🎫 Réserver une place
          </Link>
        </div>

        {/* Urgency badge */}
        {timeLeft.days < 7 && (
          <div className="mt-4 text-center">
            <span className="inline-block px-4 py-2 bg-orange-600 text-white text-xs font-bold rounded-full animate-bounce">
              ⚠️ Plus que {timeLeft.days} jours !
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
