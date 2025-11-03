"use client";
import { useState, useEffect } from "react";

interface Notification {
  id: number;
  name: string;
  action: string;
  artwork: string;
  location: string;
  timeAgo: string;
  type: "purchase" | "favorite" | "viewing";
}

const NOTIFICATIONS: Omit<Notification, "id">[] = [
  {
    name: "Sophie M.",
    action: "vient d'acheter",
    artwork: "Empreinte Ferrari #3/7",
    location: "Paris",
    timeAgo: "Il y a 2 minutes",
    type: "purchase",
  },
  {
    name: "Jean-Michel D.",
    action: "a ajouté aux favoris",
    artwork: "Projection Red Light",
    location: "Monaco",
    timeAgo: "Il y a 5 minutes",
    type: "favorite",
  },
  {
    name: "Alexandra P.",
    action: "vient d'acheter",
    artwork: "Traces de Vitesse",
    location: "Genève",
    timeAgo: "Il y a 8 minutes",
    type: "purchase",
  },
  {
    name: "Marc L.",
    action: "regarde",
    artwork: "Empreinte Ferrari #2/7",
    location: "Lyon",
    timeAgo: "En ce moment",
    type: "viewing",
  },
  {
    name: "Isabella R.",
    action: "vient d'acheter",
    artwork: "Performance Live #1",
    location: "Milan",
    timeAgo: "Il y a 12 minutes",
    type: "purchase",
  },
  {
    name: "Thomas B.",
    action: "a ajouté aux favoris",
    artwork: "Empreinte Ferrari #5/7",
    location: "Bruxelles",
    timeAgo: "Il y a 15 minutes",
    type: "favorite",
  },
  {
    name: "Carla S.",
    action: "regarde",
    artwork: "Projection Blue Speed",
    location: "Barcelone",
    timeAgo: "En ce moment",
    type: "viewing",
  },
  {
    name: "Philippe G.",
    action: "vient d'acheter",
    artwork: "Traces Exclusives",
    location: "Zurich",
    timeAgo: "Il y a 18 minutes",
    type: "purchase",
  },
];

export default function SocialProofNotifications() {
  const [activeNotification, setActiveNotification] = useState<Notification | null>(null);
  const [notificationIndex, setNotificationIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Attendre 3 secondes avant la première notification
    const initialDelay = setTimeout(() => {
      showNextNotification();
    }, 3000);

    return () => clearTimeout(initialDelay);
  }, []);

  const showNextNotification = () => {
    const notification = {
      ...NOTIFICATIONS[notificationIndex % NOTIFICATIONS.length],
      id: Date.now(),
    };

    setActiveNotification(notification);
    setIsVisible(true);

    // Masquer après 5 secondes
    setTimeout(() => {
      setIsVisible(false);
    }, 5000);

    // Préparer la prochaine notification après 6 secondes (masquage + pause)
    setTimeout(() => {
      setNotificationIndex((prev) => (prev + 1) % NOTIFICATIONS.length);
      showNextNotification();
    }, 15000 + Math.random() * 10000); // Entre 15 et 25 secondes
  };

  if (!activeNotification) return null;

  const getIcon = () => {
    switch (activeNotification.type) {
      case "purchase":
        return "🛒";
      case "favorite":
        return "❤️";
      case "viewing":
        return "👁️";
      default:
        return "✨";
    }
  };

  const getBgColor = () => {
    switch (activeNotification.type) {
      case "purchase":
        return "from-primary/95 to-background/95";
      case "favorite":
        return "from-accent/95 to-background/95";
      case "viewing":
        return "from-secondary/95 to-background/95";
      default:
        return "from-muted/95 to-background/95";
    }
  };

  return (
    <div
      className={`fixed bottom-6 left-6 z-50 max-w-sm transition-all duration-500 ${
        isVisible
          ? "translate-y-0 opacity-100"
          : "translate-y-4 opacity-0 pointer-events-none"
      }`}
    >
      <div
        className={`bg-gradient-to-r ${getBgColor()} backdrop-blur-lg border border-border rounded-2xl p-4 shadow-2xl`}
      >
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className="text-3xl flex-shrink-0">{getIcon()}</div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-foreground">
                {activeNotification.name}
              </span>
              <span className="text-xs text-muted-foreground">
                • {activeNotification.location}
              </span>
            </div>

            <p className="text-sm text-muted-foreground mb-1">
              {activeNotification.action}{" "}
              <span className="font-semibold text-foreground">
                {activeNotification.artwork}
              </span>
            </p>

            <p className="text-xs text-muted-foreground">
              {activeNotification.timeAgo}
            </p>
          </div>

          {/* Close button */}
          <button
            onClick={() => setIsVisible(false)}
            className="text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
          >
            ✕
          </button>
        </div>

        {/* Progress bar */}
        <div className="mt-3 h-1 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-accent"
            style={{
              animation: "progress 5s linear",
            }}
          />
        </div>
      </div>

      <style jsx>{`
        @keyframes progress {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
      `}</style>
    </div>
  );
}

// Composant pour afficher le nombre de personnes en ligne
export function OnlineViewers({ count }: { count: number }) {
  const [viewers, setViewers] = useState(count);

  useEffect(() => {
    const interval = setInterval(() => {
      // Variation aléatoire de ±1-3 visiteurs
      const change = Math.floor(Math.random() * 3) + 1;
      const increase = Math.random() > 0.5;
      setViewers((prev) => {
        const newCount = increase ? prev + change : Math.max(prev - change, count - 5);
        return Math.min(newCount, count + 10); // Max +10 par rapport à base
      });
    }, 8000 + Math.random() * 4000); // Entre 8 et 12 secondes

    return () => clearInterval(interval);
  }, [count]);

  return (
    <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 border border-primary/30 rounded-full text-sm">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
      </span>
      <span className="font-semibold">{viewers} personnes</span>
      <span className="text-muted-foreground">en ligne maintenant</span>
    </div>
  );
}
