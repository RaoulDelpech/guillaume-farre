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
    <div className="bg-gradient-to-br from-purple-950/30 to-black border-2 border-purple-600/30 rounded-2xl p-6 md:p-8">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="text-5xl mb-3">🏆</div>
        <h3 className="text-2xl md:text-3xl font-bold mb-2">
          Ma Collection
        </h3>
        <p className="text-gray-400">
          {favorites.length} œuvre{favorites.length > 1 ? "s" : ""} en favoris
        </p>
      </div>

      {/* Overall progress */}
      <div className="bg-black/40 border border-purple-600/30 rounded-xl p-4 mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-bold">Progression globale</span>
          <span className="text-sm text-purple-400">
            {unlockedCount}/{achievements.length} succès
          </span>
        </div>
        <div className="h-3 bg-white/10 rounded-full overflow-hidden mb-2">
          <div
            className="h-full bg-gradient-to-r from-purple-600 to-pink-600 rounded-full transition-all duration-1000"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <div className="text-xs text-gray-400">
          {progressPercentage.toFixed(0)}% complété
        </div>
      </div>

      {/* Next achievement */}
      {nextAchievement && (
        <div className="bg-gradient-to-r from-orange-950/30 to-black border-2 border-orange-600/30 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="text-4xl">{nextAchievement.icon}</div>
            <div className="flex-1">
              <div className="text-sm text-orange-500 font-bold mb-1">
                PROCHAIN SUCCÈS
              </div>
              <div className="font-bold mb-1">{nextAchievement.title}</div>
              <div className="text-sm text-gray-400">
                {nextAchievement.description}
              </div>
              <div className="mt-2">
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-orange-600 rounded-full transition-all"
                    style={{
                      width: `${
                        (favorites.length / nextAchievement.requirement) * 100
                      }%`,
                    }}
                  />
                </div>
                <div className="text-xs text-gray-400 mt-1">
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
          <h4 className="text-lg font-bold">Succès</h4>
          {achievements.length > 3 && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="text-sm text-purple-500 hover:text-purple-400"
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
                    : "bg-black/20 border-white/10 opacity-50"
                }`}
              >
                <div className="text-3xl">{achievement.icon}</div>
                <div className="flex-1">
                  <div className="font-bold text-sm">{achievement.title}</div>
                  <div className="text-xs text-gray-400">
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
      <div className="border-t border-white/10 pt-6">
        <h4 className="text-lg font-bold mb-4">Séries à collectionner</h4>
        <div className="grid gap-3">
          {categories.map((category) => (
            <div
              key={category.name}
              className="bg-black/20 border border-white/10 rounded-lg p-3"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{category.icon}</span>
                  <span className="font-semibold text-sm">
                    {category.name}
                  </span>
                </div>
                <span className="text-sm text-gray-400">
                  {category.count}/{category.total}
                </span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all bg-${category.color}-600`}
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
          <p className="text-sm text-gray-400 mb-4">
            Commencez votre collection dès maintenant !
          </p>
          <Link
            href="/boutique"
            className="inline-block px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg transition-all transform hover:scale-105"
          >
            🛒 Découvrir les œuvres
          </Link>
        </div>
      ) : (
        <div className="mt-6 bg-gradient-to-r from-purple-950/30 to-pink-950/30 border border-purple-600/30 rounded-lg p-4 text-center">
          <div className="text-sm text-gray-300 mb-2">
            Continuez à collectionner pour débloquer tous les succès !
          </div>
          <Link
            href="/boutique"
            className="text-purple-400 hover:text-purple-300 font-bold text-sm"
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
              const text = `J'ai ${favorites.length} œuvres de Guillaume Farré dans ma collection ! 🎨🏎️`;
              if (navigator.share) {
                navigator.share({ text, url: window.location.origin });
              } else {
                navigator.clipboard.writeText(
                  `${text} ${window.location.origin}`
                );
                alert("Lien copié !");
              }
            }}
            className="text-sm text-gray-400 hover:text-white transition-all"
          >
            📤 Partager ma collection
          </button>
        </div>
      )}
    </div>
  );
}
