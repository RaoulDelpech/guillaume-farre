/**
 * Instagram Optimizer - Strategie 30 jours
 *
 * @author Lalou
 */

/**
 * Genere une strategie Instagram complete sur 30 jours
 */
export function generate30DayInstagramStrategy(_photos: Array<{path: string; title: string; category: string}>) {
  return {
    overview: `
**Stratégie Instagram 30 jours - Guillaume Farré**

🎯 OBJECTIF :
- +2000 followers qualifiés (collectionneurs)
- 10-15% engagement rate
- 5-10 leads qualifiés (DMs sérieux)
- 2-3 ventes directes

📅 FRÉQUENCE :
- 3-4 posts / semaine
- Mix : 60% Reels, 30% Carousel, 10% Posts

🎨 CONTENUS :
Semaine 1 : Processus création (Reels behind-the-scenes)
Semaine 2 : Série "Empreintes" (Carousels détails)
Semaine 3 : Formats monumentaux (Reels wow-factor)
Semaine 4 : Collectionneurs testimonials + Rétrospective mois
    `,

    weeklyPlan: [
      {
        week: 1,
        theme: 'Découverte du processus',
        posts: [
          { day: 'mardi', type: 'reel', topic: 'Ferrari en action (time-lapse)' },
          { day: 'jeudi', type: 'carousel', topic: 'Série Atelier (5 œuvres)' },
          { day: 'samedi', type: 'reel', topic: 'Zoom détails peinture' },
        ],
      },
    ],

    hashtagRotation: 'Varier les hashtags chaque post (éviter spam Instagram)',

    metrics: {
      trackDaily: ['Reach', 'Engagement rate', 'Profile visits', 'Website clicks'],
      trackWeekly: ['Follower growth', 'DMs received', 'Top performing posts'],
      trackMonthly: ['Revenue generated', 'Collector conversions', 'International reach'],
    },
  };
}
