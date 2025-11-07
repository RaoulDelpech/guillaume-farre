import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import fs from 'fs';
import path from 'path';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

// Prompts selon catégorie
const getPrompt = (category: string, seriesName?: string): string => {
  const isLimited = category === 'limited' || seriesName;

  if (isLimited) {
    return `Décris cette photographie d'art capturant l'instant où une Ferrari peint une toile.

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
  try {
    const { photoPath, photoFilename, category, seriesName } = await request.json();

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: 'ANTHROPIC_API_KEY non configurée' },
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
    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
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
    console.error('Erreur génération description IA:', error);
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
