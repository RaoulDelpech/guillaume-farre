import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import fs from 'fs';
import path from 'path';
import { requireAdminAuth } from '@/lib/admin/auth';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

// Prompts selon catégorie
const getPrompt = (category: string, seriesName?: string): string => {
  const isLimited = category === 'limited' || seriesName;

  if (isLimited) {
    return `Décris cette photographie d'art de Guillaume Farré.

Consignes:
- Texte poétique mais précis, technique sans jargon
- 2-3 phrases maximum
- Mentionne: couleurs dominantes, mouvement capturé, effet abstrait créé
- Évoque la tension entre contrôle et accident
- Ton: contemplatif, artistique, pas promotionnel

Ne mentionne PAS:
- Prix, édition, vente
- "Cette œuvre", "cette pièce"
- Superlatifs excessifs`;
  }

  return `Décris brièvement cette photo documentaire montrant une Ferrari en train de créer une toile.

Consignes:
- 1-2 phrases claires, accessibles
- Décris ce qu'on voit: la Ferrari, les traces, les couleurs
- Ton: direct, factuel, sans lyrisme excessif

Ne mentionne PAS:
- Prix, édition, vente
- "Cette œuvre", "cette photo"`;
};

export async function POST(request: NextRequest) {
  const authError = await requireAdminAuth();
  if (authError) return authError;

  try {
    const { photoPath, photoFilename, category, seriesName } = await request.json();

    // Vérification clé API avec message détaillé
    if (!process.env.ANTHROPIC_API_KEY) {
      console.error('[generate-description] ANTHROPIC_API_KEY manquante dans .env.local');
      return NextResponse.json(
        {
          error: 'Clé API Anthropic manquante. Ajoutez ANTHROPIC_API_KEY dans .env.local puis redémarrez le serveur.',
          details: 'Configuration requise: ANTHROPIC_API_KEY=sk-ant-api03-...'
        },
        { status: 500 }
      );
    }

    if (!process.env.ANTHROPIC_API_KEY.startsWith('sk-ant-')) {
      console.error('[generate-description] Format clé API invalide:', process.env.ANTHROPIC_API_KEY.substring(0, 10) + '...');
      return NextResponse.json(
        {
          error: 'Format de clé API invalide. La clé doit commencer par "sk-ant-"',
          details: 'Obtenez une nouvelle clé sur https://console.anthropic.com/settings/keys'
        },
        { status: 500 }
      );
    }

    // Lire l'image depuis le système de fichiers
    const imagePath = path.join(process.cwd(), 'public', photoPath.replace(/^\//, ''));

    if (!fs.existsSync(imagePath)) {
      return NextResponse.json(
        { error: `Image non trouvée: ${photoPath}` },
        { status: 404 }
      );
    }

    const imageData = fs.readFileSync(imagePath);
    const base64Image = imageData.toString('base64');
    const mimeType = photoPath.endsWith('.png') ? 'image/png' : 'image/jpeg';

    // Appel API Anthropic Claude Vision
    let message;
    try {
      message = await anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022', // Sonnet pour meilleure qualité descriptions artistiques
        max_tokens: 300,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image',
                source: {
                  type: 'base64',
                  media_type: mimeType,
                  data: base64Image,
                },
              },
              {
                type: 'text',
                text: getPrompt(category, seriesName),
              },
            ],
          },
        ],
      });
    } catch (apiError: any) {
      console.error('[generate-description] Erreur API Anthropic:', apiError);

      // Erreurs spécifiques Anthropic
      if (apiError.status === 401) {
        return NextResponse.json(
          {
            error: 'Clé API Anthropic invalide ou expirée',
            details: 'Générez une nouvelle clé sur https://console.anthropic.com/settings/keys'
          },
          { status: 401 }
        );
      }

      if (apiError.status === 404) {
        return NextResponse.json(
          {
            error: 'Modèle Claude non disponible',
            details: 'Le modèle "claude-3-sonnet-20240229" n\'est pas accessible. Vérifiez vos permissions API.'
          },
          { status: 404 }
        );
      }

      if (apiError.status === 429) {
        return NextResponse.json(
          {
            error: 'Limite de requêtes dépassée',
            details: 'Attendez quelques secondes avant de réessayer.'
          },
          { status: 429 }
        );
      }

      // Erreur générique API
      return NextResponse.json(
        {
          error: apiError.message || 'Erreur lors de l\'appel à l\'API Anthropic',
          details: apiError.error?.message || apiError.toString()
        },
        { status: apiError.status || 500 }
      );
    }

    const description = message.content[0].type === 'text'
      ? message.content[0].text
      : '';

    return NextResponse.json({
      success: true,
      description,
      photoFilename,
      aiGenerated: true,
    });

  } catch (error) {
    console.error('[generate-description] Erreur inattendue:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Erreur inconnue',
        details: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

// Lalou
