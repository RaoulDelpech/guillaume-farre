import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { requireAdminAuth } from '@/lib/admin/auth';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export interface SeriesSuggestion {
  seriesName: string;
  photos: string[];
  reasoning: string;
  confidence: 'high' | 'medium' | 'low';
}

export async function POST(request: NextRequest) {
  const authError = await requireAdminAuth();
  if (authError) return authError;

  try {
    const { photos } = await request.json();

    if (!photos || photos.length === 0) {
      return NextResponse.json(
        { error: 'Aucune photo fournie' },
        { status: 400 }
      );
    }

    // Préparer les images pour Claude
    const imageContents = await Promise.all(
      photos.map(async (photoPath: string) => {
        const fullPath = join(process.cwd(), 'public', photoPath.replace(/^\//, ''));
        const imageBuffer = await readFile(fullPath);
        const base64Image = imageBuffer.toString('base64');

        // Déterminer le type MIME
        const ext = photoPath.toLowerCase().split('.').pop();
        const mediaType = ext === 'png' ? 'image/png' :
                         ext === 'webp' ? 'image/webp' : 'image/jpeg';

        return {
          type: 'image' as const,
          source: {
            type: 'base64' as const,
            media_type: mediaType,
            data: base64Image,
          },
        };
      })
    );

    // Analyser les photos avec Claude
    const message = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 2000,
      messages: [
        {
          role: 'user',
          content: [
            ...imageContents,
            {
              type: 'text',
              text: `Tu es un expert en photographie d'art. Analyse ces ${photos.length} photos uploadées par Guillaume Farré.

RÈGLE ABSOLUE : Ne suggère des séries QUE si les photos se ressemblent VISUELLEMENT de manière ÉVIDENTE et FORTE.

Critères de similitude visuelle STRICTE (tous requis) :
1. PALETTE DE COULEURS quasi-identique (mêmes dominantes, mêmes tons)
2. COMPOSITION similaire (cadrage, angles, disposition éléments)
3. SUJET principal identique ou très proche (même objet, même scène, même type)
4. ÉCLAIRAGE et AMBIANCE comparables (même luminosité, même atmosphère)
5. STYLE VISUEL cohérent (même rendu, même traitement)

EXEMPLES DE VRAIES SÉRIES (similitudes FORTES) :
✅ Plusieurs photos de la MÊME voiture rouge sous différents angles
✅ Série de peintures abstraites ROUGE/NOIR avec traces similaires
✅ Suite de close-ups d'un même motif mécanique (pneus, carrosserie)

EXEMPLES DE FAUSSES SÉRIES (similitudes FAIBLES - À REJETER) :
❌ Une voiture rouge + une voiture grise (couleurs différentes = pas série)
❌ Un atelier avec voitures + un close-up de pneu (composition trop différente = pas série)
❌ Peinture rouge abstraite + photo réaliste de Ferrari (style trop différent = pas série)

**SI TU HÉSITES, NE CRÉE PAS DE SÉRIE.** Mieux vaut retourner aucune suggestion que de regrouper des photos qui ne se ressemblent pas vraiment.

Pour chaque série suggérée (SEULEMENT si similitude ÉVIDENTE), fournis :
1. Nom de série court (2-4 mots max)
2. Indices photos (0, 1, 2, etc.)
3. Explication PRÉCISE des similitudes visuelles
4. Confiance : "high" (uniquement si similitudes TRÈS fortes)

Réponds UNIQUEMENT avec un JSON valide :

{
  "suggestions": [
    {
      "seriesName": "Nom de la série",
      "photoIndices": [0, 2, 4],
      "reasoning": "Explication précise des similitudes visuelles",
      "confidence": "high"
    }
  ]
}

Si aucune similitude visuelle FORTE et ÉVIDENTE, retourne : { "suggestions": [] }`,
            },
          ],
        },
      ],
    });

    // Parser la réponse de Claude
    const responseText = message.content[0].type === 'text'
      ? message.content[0].text
      : '';

    // Extraire le JSON de la réponse
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({
        suggestions: [],
      });
    }

    const analysis = JSON.parse(jsonMatch[0]);

    // Convertir les indices en chemins de photos
    const suggestions: SeriesSuggestion[] = analysis.suggestions.map((suggestion: any) => ({
      seriesName: suggestion.seriesName,
      photos: suggestion.photoIndices.map((idx: number) => photos[idx]),
      reasoning: suggestion.reasoning,
      confidence: suggestion.confidence,
    }));

    return NextResponse.json({
      suggestions,
    });

  } catch (error: any) {
    console.error('Erreur lors de l\'analyse des séries:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur lors de l\'analyse' },
      { status: 500 }
    );
  }
}
