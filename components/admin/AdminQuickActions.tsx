"use client";

import Link from "next/link";

/**
 * Actions rapides pour le dashboard admin
 * Liens directs vers les fonctions les plus utilisées
 *
 * @author Lalou
 * @date 2025-01-20
 */
export default function AdminQuickActions() {
  const actions = [
    {
      title: "Modifier les textes",
      description: "Éditer les textes du site en mode admin",
      href: "/fr?admin=true",
      icon: "✏️",
      color: "amber",
    },
    {
      title: "Voir le site",
      description: "Ouvrir le site en mode visiteur",
      href: "/fr",
      icon: "🌐",
      color: "blue",
    },
    {
      title: "Voir les contacts",
      description: "Messages reçus via le formulaire",
      href: "/fr/admin/contacts",
      icon: "📬",
      color: "green",
    },
    {
      title: "Réservations VIP",
      description: "Toutes les réservations toiles : statuts, actions",
      href: "/fr/admin/vip/reservations",
      icon: "🎨",
      color: "amber",
    },
    {
      title: "Réinitialiser l'onboarding",
      description: "Revoir le tutoriel du mode édition",
      icon: "🎓",
      color: "purple",
      onClick: () => {
        localStorage.removeItem("gf_admin_onboarding_completed");
        window.location.href = "/fr?admin=true";
      },
    },
  ];

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-light tracking-wide mb-6 text-foreground">
        Actions rapides
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((action) => {
          const colorClasses = {
            amber: "border-amber-500/30 hover:border-amber-500/60 hover:bg-amber-500/5",
            blue: "border-blue-500/30 hover:border-blue-500/60 hover:bg-blue-500/5",
            green: "border-green-500/30 hover:border-green-500/60 hover:bg-green-500/5",
            purple: "border-purple-500/30 hover:border-purple-500/60 hover:bg-purple-500/5",
          }[action.color];

          const content = (
            <>
              <div className="text-3xl mb-3">{action.icon}</div>
              <h3 className="font-medium text-foreground mb-1">{action.title}</h3>
              <p className="text-xs text-muted-foreground">{action.description}</p>
            </>
          );

          if (action.onClick) {
            return (
              <button
                key={action.title}
                onClick={action.onClick}
                className={`bg-card border rounded-lg p-5 text-left transition-all ${colorClasses}`}
              >
                {content}
              </button>
            );
          }

          return (
            <Link
              key={action.title}
              href={action.href!}
              className={`bg-card border rounded-lg p-5 transition-all ${colorClasses}`}
            >
              {content}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
