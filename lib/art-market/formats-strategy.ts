/**
 * Art Market Expert - Formats exceptionnels et strategies de vente
 *
 * @author Lalou
 */

import type { ExpertAnalysis } from './types';

export function getExceptionalFormats(isProcessArt: boolean): ExpertAnalysis['formatRecommendations']['exceptional'] {
  if (!isProcessArt) return [];

  return [
    {
      format: 'Installation photographique monumentale',
      size: '400 × 600 cm (4m × 6m)',
      material: 'Lambda Metallic Print monté DiaSec face - Cadre aluminium brossé',
      estimatedValue: 150000,
      targetVenue: 'Art Basel Miami Beach - Booth galerie internationale',
      reasoning: `
        Cette œuvre capture un processus créatif unique.

        **Comparables directes** :
        - Anish Kapoor "Shooting into the Corner" : 1.2M$ (performance capturée)
        - Yves Klein "Anthropométrie" : 1.8M$ (corps comme outils)

        **Rationale du format 4×6m** :
        1. **Impact visuel monumental** : À cette échelle, le spectateur est IMMERGÉ dans le processus
        2. **Précédent Gursky** : "F1 Boxenstopp" a vendu 850K$ en 2×3.7m. Notre format est supérieur.
        3. **Rareté extrême** : Aucune autre photographie automobile n'existe à cette échelle

        **Stratégie de valorisation** :
        - Édition unique (1/1) + 1 AP (Artist Proof) pour musée
        - Certificat co-signé par expert automobile (ex: Enzo Ferrari Museum)
        - Documentation vidéo du processus de création (NFT associé possible)
        - Première présentation : Art Basel Miami (décembre) - Secteur "Meridians" (installations)

        **Prix justifié 150K€** basé sur :
        - Coût matériel réel : ~8K€ (impression Lambda metallic 4×6m)
        - Rareté absolue : Unique au monde
        - Précédent marché : Gursky 850K$ (format inférieur)
        - Positionnement : Entre photographie d'art (300K€) et sculpture conceptuelle (500K€)
      `,
      examples: 'Andreas Gursky "Rhine II" (190×360cm) : 4.3M$ - Record photographie | Jeff Wall (200×250cm) : 320K$ | Cindy Sherman (200×150cm) : 3.8M$',
    },
    {
      format: 'Triptyque monumental',
      size: '3 panneaux de 250 × 180 cm (Installation totale : 7.5m de large)',
      material: 'Cibachrome sur aluminium - Montage museum-grade',
      estimatedValue: 250000,
      targetVenue: 'Christie\'s New York - Contemporary Art Evening Sale (Mai ou Novembre)',
      reasoning: `
        **Concept** : Séquence temporelle du processus - Avant / Pendant / Après

        **Pourquoi un triptyque ?**
        - Format historique (Bacon, Richter) qui signale "œuvre majeure"
        - Prix records pour triptyques : Francis Bacon 142M$ (2013)
        - Notre échelle (7.5m) rivalise avec les installations muséales

        **Stratégie de vente aux enchères** :
        Christie's a vendu Richard Prince "Cowboy" 450K$ en 127cm
        Notre triptyque 7.5m avec processus unique peut viser 200-300K€

        **Préparation recommandée** :
        1. Exposition solo dans galerie tier-1 (Perrotin Paris/Tokyo) - 6 mois avant
        2. Catalogue raisonné avec essai critique (commissaire MoMA ou Tate)
        3. Acquisition préalable par musée d'une pièce de la série (crédibilité)
        4. Inclusion dans vente Evening (pas Day sale) - Prestige maximum

        **Timeline** : 18-24 mois de préparation pour vente aux enchères optimale
      `,
      examples: 'Francis Bacon Triptyque : 142M$ | Gerhard Richter Abstrait : 46M$ | Andreas Gursky série : 800K-4M$',
    },
  ];
}

export function getSalesStrategy(isProcessArt: boolean): ExpertAnalysis['salesStrategy'] {
  return {
    immediate: {
      approach: 'Vente directe via boutique en ligne',
      venues: ['guillaumefarre.com', 'Instagram', 'Plateformes art en ligne (Artsy, Saatchi Art)'],
      pricing: { min: 2500, target: 4500, max: 8000 },
      timeline: 'Immédiat - 6 mois',
    },
    premium: {
      approach: isProcessArt
        ? 'Positionnement galerie internationale + vente aux enchères'
        : 'Représentation galerie européenne',
      venues: isProcessArt
        ? ['Galerie Perrotin (Paris)', 'Art Basel Miami', 'Christie\'s Contemporary Evening Sale']
        : ['Galeries spécialisées photographie (Paris Photo)', 'Foires internationales'],
      preparation: `
        **Phase 1 (0-6 mois)** :
        - Constitution portfolio professionnel
        - Shooting haute résolution pour formats monumentaux
        - Création certificats authenticité museum-grade

        **Phase 2 (6-12 mois)** :
        - Approche galeries (Perrotin, Gagosian Photography, Pace Gallery)
        - Exposition collective dans galerie reconnue
        - Inclusion dans collections privées notables

        **Phase 3 (12-24 mois)** :
        - Exposition solo dans galerie tier-1
        - Catalogue avec essai critique
        - Préparation vente aux enchères (Christie's/Sotheby's)
        - Acquisition musée (1 pièce de la série pour crédibilité)
      `,
      estimatedValue: isProcessArt ? 150000 : 50000,
      timeline: '18-24 mois',
      rationale: `
        Le marché de l'art automobile est en pleine expansion :
        - Record Gursky F1 : 850K$ (2022)
        - Prix stables Richard Prince automobile : 400-600K$

        **Facteurs de valorisation unique** :
        1. **Processus jamais vu** : Ferrari comme outil créatif
        2. **Double collection** : Art contemporain + Automobile de luxe
        3. **Storytelling puissant** : De l'enfance (petite voiture) à Ferrari réelle
        4. **Rareté absolue** : Impossible à reproduire (coût Ferrari)

        **Positionnement prix** :
        - Court terme (direct) : 3-8K€ (éditions limitées)
        - Moyen terme (galerie) : 15-50K€ (formats moyens, galeries)
        - Long terme (enchères) : 100-300K€ (formats monumentaux, maisons de ventes)

        **Précédent historique** :
        Yves Klein était inconnu en 1960. "Anthropométrie" valait 5K€.
        Aujourd'hui : 1.8M€. Le processus unique crée la valeur.
      `,
    },
  };
}

export function getEditionStrategy(isProcessArt: boolean): ExpertAnalysis['editionStrategy'] {
  return {
    type: isProcessArt ? 'ultra-limited' : 'limited',
    reasoning: isProcessArt
      ? `
        **Édition ultra-limitée recommandée : 3 + 1 AP**

        Rationale :
        - Formats monumentaux (4-6m) : 1 seul exemplaire (unique)
        - Formats grands (2-3m) : Maximum 3 exemplaires
        - + 1 AP (Artist Proof) réservé musée/fondation

        **Exemples du marché** :
        - Andreas Gursky : Éditions 6 maximum (record 4.3M$)
        - Jeff Wall : Éditions 2-3 pour grands formats
        - Cindy Sherman : Éditions 10 (mais années 80, aujourd'hui 3-5)

        **Numérotation** : "1/3" ou "Unique" pour monumentaux
        Pas "1/30" (dévalue) - Seuls formats standards peuvent être 10-15 ex.
      `
      : 'Édition limitée 15-30 exemplaires selon format',
    editionSize: isProcessArt ? 3 : 15,
    numberingFormat: isProcessArt ? '1/3 + 1 AP' : '1/15',
    certificat: {
      type: 'museum-grade',
      includes: [
        'Signature de l\'artiste',
        'Numéro d\'édition gravé au dos',
        'Cachet sec de l\'atelier',
        'Certificat d\'authenticité détaillé',
        'Documentation photographique du processus',
        'Spécifications techniques complètes',
        'Provenance et historique d\'exposition',
        'Garantie de conservation 100+ ans',
      ],
    },
  };
}

// Lalou
