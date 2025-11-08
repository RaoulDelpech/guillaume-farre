import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { readFile } from 'fs/promises';
import { join } from 'path';

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
              text: `Tu es un expert en art et en photographie. Analyse ces ${photos.length} photos uploadées par Guillaume Farré, un artiste qui travaille avec la peinture et la photographie.

Ton rôle est de suggérer des regroupements en séries cohérentes basées sur :
- Les similitudes visuelles (couleurs, compositions, textures)
- Les sujets ou thèmes communs
- Le style ou la technique utilisée
- L'atmosphère ou l'émotion dégagée

**IMPORTANT** : Ne suggère des séries QUE si tu identifies de vraies similitudes fortes. Si les photos sont trop différentes, dis simplement qu'aucune série cohérente ne se dégage.

Pour chaque série suggérée, fournis :
1. Un nom de série court et évocateur (2-4 mots max)
2. Les indices des photos à inclure (0, 1, 2, etc.)
3. Une explication concise de pourquoi ces photos forment une série
4. Un niveau de confiance : "high" (similitudes très fortes), "medium" (similitudes modérées), ou "low" (similitudes faibles)

Réponds UNIQUEMENT avec un JSON valide au format suivant :

{
  "suggestions": [
    {
      "seriesName": "Nom de la série",
      "photoIndices": [0, 2, 4],
      "reasoning": "Explication de la cohérence",
      "confidence": "high"
    }
  ]
}

Si aucune série ne se dégage clairement, retourne : { "suggestions": [] }`,
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
