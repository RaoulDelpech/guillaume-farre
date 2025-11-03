"use client";
import { useFavorites } from "@/hooks/useFavorites";
import { useEffect, useState } from "react";
import { Link } from "@/i18n/routing";
import { useConfetti } from "@/hooks/useConfetti";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  requirement: number;
  unlocked: boolean;
}

export default function CollectionTracker() {
  const { favorites } = useFavorites();
  const [mounted, setMounted] = useState(false);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [showAll, setShowAll] = useState(false);
  const { fireConfetti } = useConfetti();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const allAchievements: Achievement[] = [
      {
        id: "first_favorite",
        title: "Première étincelle",
        description: "Ajoutez votre première œuvre aux favoris",
        icon: "⭐",
        requirement: 1,
        unlocked: favorites.length >= 1,
      },
      {
        id: "three_favorites",
        title: "Œil de connaisseur",
        description: "Ajoutez 3 œuvres aux favoris",
        icon: "👁️",
        requirement: 3,
        unlocked: favorites.length >= 3,
      },
      {
        id: "five_favorites",
        title: "Collectionneur passionné",
        description: "Ajoutez 5 œuvres aux favoris",
        icon: "🎨",
        requirement: 5,
        unlocked: favorites.length >= 5,
      },
      {
        id: "ten_favorites",
        title: "Véritable collectionneur",
        description: "Ajoutez 10 œuvres aux favoris",
        icon: "🏆",
        requirement: 10,
        unlocked: favorites.length >= 10,
      },
      {
        id: "twenty_favorites",
        title: "Expert Guillaume Farré",
        description: "Ajoutez 20 œuvres aux favoris",
        icon: "👑",
        requirement: 20,
        unlocked: favorites.length >= 20,
      },
    ];

    // Check if we just unlocked a new achievement
    const newlyUnlocked = allAchievements.filter(
      (a) =>
        a.unlocked &&
        !achievements.find((prev) => prev.id === a.id && prev.unlocked)
    );

    if (newlyUnlocked.length > 0) {
      fireConfetti();
    }

    setAchievements(allAchievements);
  }, [favorites, mounted]);

  if (!mounted) return null;

  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const nextAchievement = achievements.find((a) => !a.unlocked);
  const progressPercentage = (unlockedCount / achievements.length) * 100;

  // Collection categories/series
  const categories = [
    {
      name: "Empreintes Ferrari",
      icon: "🏎️",
      count: 0,
      total: 15,
      color: "red",
    },
    {
      name: "Série Abstrait",
      icon: "🎨",
      count: 0,
      total: 10,
      color: "purple",
    },
    {
      name: "Éditions limitées",
      icon: "💎",
      count: 0,
      total: 8,
      color: "blue",
    },
    {
      name: "Pièces uniques",
      icon: "⭐",
      count: 0,
      total: 5,
      color: "yellow",
    },
  ];

  return (
    <div className="bg-card border-2 border-border rounded-2xl p-6 md:p-8">
      {/* Header */}
      <div className="text-center mb-6">
        <h3 className="text-2xl md:text-3xl font-bold mb-2">
          Ma Collection
        </h3>
        <p className="text-muted-foreground">
          {favorites.length} œuvre{favorites.length > 1 ? "s" : ""} en favoris
        </p>
      </div>

      {/* Overall progress */}
      <div className="bg-muted/40 border border-border rounded-xl p-4 mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold">Progression globale</span>
          <span className="text-sm text-primary">
            {unlockedCount}/{achievements.length} succès
          </span>
        </div>
        <div className="h-3 bg-muted rounded-full overflow-hidden mb-2">
          <div
            className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-1000"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <div className="text-xs text-muted-foreground">
          {progressPercentage.toFixed(0)}% complété
        </div>
      </div>

      {/* Next achievement */}
      {nextAchievement && (
        <div className="bg-accent/20 border-2 border-accent/30 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="text-4xl">{nextAchievement.icon}</div>
            <div className="flex-1">
              <div className="text-sm text-accent font-semibold mb-1">
                PROCHAIN SUCCÈS
              </div>
              <div className="font-semibold mb-1">{nextAchievement.title}</div>
              <div className="text-sm text-muted-foreground">
                {nextAchievement.description}
              </div>
              <div className="mt-2">
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-accent rounded-full transition-all"
                    style={{
                      width: `${
                        (favorites.length / nextAchievement.requirement) * 100
                      }%`,
                    }}
                  />
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {favorites.length}/{nextAchievement.requirement}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Achievements list */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-lg font-semibold">Succès</h4>
          {achievements.length > 3 && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="text-sm text-primary hover:text-accent"
            >
              {showAll ? "Voir moins" : "Voir tout"}
            </button>
          )}
        </div>

        <div className="space-y-2">
          {(showAll ? achievements : achievements.slice(0, 3)).map(
            (achievement) => (
              <div
                key={achievement.id}
                className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                  achievement.unlocked
                    ? "bg-green-950/20 border-green-600/30"
                    : "bg-muted/20 border-border opacity-50"
                }`}
              >
                <div className="text-3xl">{achievement.icon}</div>
                <div className="flex-1">
                  <div className="font-semibold text-sm">{achievement.title}</div>
                  <div className="text-xs text-muted-foreground">
                    {achievement.description}
                  </div>
                </div>
                {achievement.unlocked && (
                  <div className="text-green-500 font-bold text-xl">✓</div>
                )}
              </div>
            )
          )}
        </div>
      </div>

      {/* Collection categories */}
      <div className="border-t border-border pt-6">
        <h4 className="text-lg font-semibold mb-4">Séries à collectionner</h4>
        <div className="grid gap-3">
          {categories.map((category) => (
            <div
              key={category.name}
              className="bg-muted/20 border border-border rounded-lg p-3"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{category.icon}</span>
                  <span className="font-semibold text-sm">
                    {category.name}
                  </span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {category.count}/{category.total}
                </span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all bg-primary"
                  style={{
                    width: `${(category.count / category.total) * 100}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      {favorites.length === 0 ? (
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground mb-4">
            Commencez votre collection dès maintenant !
          </p>
          <Link
            href="/boutique"
            className="inline-block px-6 py-3 bg-primary hover:bg-accent text-primary-foreground font-semibold rounded-lg transition-all"
          >
            Découvrir les œuvres
          </Link>
        </div>
      ) : (
        <div className="mt-6 bg-accent/20 border border-accent/30 rounded-lg p-4 text-center">
          <div className="text-sm text-foreground mb-2">
            Continuez à collectionner pour débloquer tous les succès !
          </div>
          <Link
            href="/boutique"
            className="text-primary hover:text-accent font-semibold text-sm"
          >
            Voir plus d'œuvres →
          </Link>
        </div>
      )}

      {/* Share progress */}
      {favorites.length >= 3 && (
        <div className="mt-4 text-center">
          <button
            onClick={() => {
              const text = `J'ai ${favorites.length} œuvres de Guillaume Farré dans ma collection.`;
              if (navigator.share) {
                navigator.share({ text, url: window.location.origin });
              } else {
                navigator.clipboard.writeText(
                  `${text} ${window.location.origin}`
                );
                alert("Lien copié !");
              }
            }}
            className="text-sm text-muted-foreground hover:text-foreground transition-all"
          >
            Partager ma collection
          </button>
        </div>
      )}
    </div>
  );
}
