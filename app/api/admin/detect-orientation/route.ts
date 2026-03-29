/**
 * API de détection d'orientation des photos avec Anthropic Vision
 * Utilise Claude pour analyser l'image et déterminer si elle est verticale ou horizontale
 *
 * // Lalou
 */

import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { promises as fs } from 'fs';
import path from 'path';
import { requireAdminAuth } from '@/lib/admin/auth';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

export async function POST(req: NextRequest) {
  const authError = await requireAdminAuth();
  if (authError) return authError;

  try {
    const { photoPath } = await req.json();

    if (!photoPath) {
      return NextResponse.json(
        { error: 'Photo path is required' },
        { status: 400 }
      );
    }

    // Construire le chemin absolu de l'image
    const fullPath = path.join(process.cwd(), 'public', photoPath);

    // Vérifier que le fichier existe
    try {
      await fs.access(fullPath);
    } catch (error) {
      return NextResponse.json(
        { error: 'Photo not found' },
        { status: 404 }
      );
    }

    // Lire l'image et la convertir en base64
    const imageBuffer = await fs.readFile(fullPath);
    const base64Image = imageBuffer.toString('base64');

    // Déterminer le type MIME de l'image
    const extension = path.extname(photoPath).toLowerCase();
    const mimeTypeMap: Record<string, 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp'> = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.webp': 'image/webp',
    };
    const mediaType = mimeTypeMap[extension] || 'image/jpeg';

    // Appeler l'API Anthropic Vision
    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 50,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: mediaType,
                data: base64Image,
              },
            },
            {
              type: 'text',
              text: "Is this image in portrait (vertical) or landscape (horizontal) orientation? Reply with only one word: 'vertical' or 'horizontal'.",
            },
          ],
        },
      ],
    });

    // Extraire la réponse
    const content = message.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type from Anthropic');
    }

    const orientation = content.text.trim().toLowerCase();

    // Valider la réponse
    if (orientation !== 'vertical' && orientation !== 'horizontal') {
      console.error('Unexpected orientation response:', orientation);
      return NextResponse.json(
        { error: 'Invalid orientation detected', raw: orientation },
        { status: 500 }
      );
    }


    return NextResponse.json({
      success: true,
      orientation: orientation as 'vertical' | 'horizontal',
      photoPath,
    });
  } catch (error) {
    console.error('❌ Error detecting orientation:', error);
    return NextResponse.json(
      {
        error: 'Failed to detect orientation',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// Lalou
