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
    <div className="bg-card border-2 border-primary/40 rounded-2xl p-6 md:p-8 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 animate-pulse" />

      <div className="relative z-10">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-block px-4 py-2 bg-primary rounded-full text-sm font-semibold mb-3 animate-pulse">
            🎨 PERFORMANCE LIVE EN DIRECT
          </div>
          <h3 className="text-2xl md:text-3xl font-bold mb-2">
            Prochaine création en direct
          </h3>
          <p className="text-muted-foreground text-sm mb-1">
            📅 {formatDate()}
          </p>
          <p className="text-muted-foreground text-xs">
            📍 Circuit Paul Ricard, Le Castellet
          </p>
        </div>

        {/* Countdown */}
        <div className="grid grid-cols-4 gap-3 md:gap-4 mb-6">
          <div className="bg-muted/40 border border-primary/30 rounded-xl p-3 md:p-4 text-center">
            <div className="text-3xl md:text-4xl font-bold text-primary mb-1">
              {String(timeLeft.days).padStart(2, "0")}
            </div>
            <div className="text-xs md:text-sm text-muted-foreground">Jours</div>
          </div>
          <div className="bg-muted/40 border border-primary/30 rounded-xl p-3 md:p-4 text-center">
            <div className="text-3xl md:text-4xl font-bold text-primary mb-1">
              {String(timeLeft.hours).padStart(2, "0")}
            </div>
            <div className="text-xs md:text-sm text-muted-foreground">Heures</div>
          </div>
          <div className="bg-muted/40 border border-primary/30 rounded-xl p-3 md:p-4 text-center">
            <div className="text-3xl md:text-4xl font-bold text-primary mb-1">
              {String(timeLeft.minutes).padStart(2, "0")}
            </div>
            <div className="text-xs md:text-sm text-muted-foreground">Minutes</div>
          </div>
          <div className="bg-muted/40 border border-primary/30 rounded-xl p-3 md:p-4 text-center">
            <div className="text-3xl md:text-4xl font-bold text-primary mb-1 animate-pulse">
              {String(timeLeft.seconds).padStart(2, "0")}
            </div>
            <div className="text-xs md:text-sm text-muted-foreground">Secondes</div>
          </div>
        </div>

        {/* Details */}
        <div className="bg-muted/30 border border-border rounded-xl p-4 mb-4">
          <h4 className="font-semibold mb-2 text-sm md:text-base">
            🎨 Ce qui vous attend :
          </h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">🏎️</span>
              <span>Performance live avec la Ferrari 458 Italia</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">🎥</span>
              <span>Diffusion en direct sur nos réseaux sociaux</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">🖼️</span>
              <span>Création de 3 œuvres uniques en édition limitée</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">🎫</span>
              <span>Possibilité de réserver votre œuvre en avant-première</span>
            </li>
          </ul>
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/performances"
            className="flex-1 px-6 py-3 bg-primary hover:bg-accent text-primary-foreground font-semibold rounded-lg text-center transition-all"
          >
            Être notifié(e)
          </Link>
          <Link
            href="/contact"
            className="flex-1 px-6 py-3 bg-card hover:bg-accent/20 border-2 border-border text-foreground font-semibold rounded-lg text-center transition-all"
          >
            Réserver une place
          </Link>
        </div>

        {/* Urgency badge */}
        {timeLeft.days < 7 && (
          <div className="mt-4 text-center">
            <span className="inline-block px-4 py-2 bg-accent text-primary-foreground text-xs font-semibold rounded-full animate-bounce">
              ⚠️ Plus que {timeLeft.days} jours !
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
