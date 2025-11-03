/**
 * 📱 API Publication Instagram
 *
 * POST /api/instagram/post - Publie un post sur Instagram via Graph API
 */

import { NextResponse } from 'next/server';

interface InstagramPostRequest {
  imageUrl: string;
  caption: string;
}

/**
 * Publie une image sur Instagram
 */
export async function POST(request: Request) {
  try {
    const { imageUrl, caption }: InstagramPostRequest = await request.json();

    // Récupérer les credentials depuis les variables d'environnement
    const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
    const instagramAccountId = process.env.INSTAGRAM_ACCOUNT_ID;

    if (!imageUrl || !caption) {
      return NextResponse.json(
        { success: false, error: 'Image URL et caption requis' },
        { status: 400 }
      );
    }

    if (!accessToken || !instagramAccountId) {
      return NextResponse.json(
        { success: false, error: 'Configuration Instagram manquante. Ajoutez INSTAGRAM_ACCESS_TOKEN et INSTAGRAM_ACCOUNT_ID dans .env.local' },
        { status: 500 }
      );
    }

    console.log('📱 Publication Instagram en cours...');

    // ÉTAPE 1: Créer le conteneur média (upload de l'image)
    const createMediaResponse = await fetch(
      `https://graph.facebook.com/v18.0/${instagramAccountId}/media`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image_url: imageUrl,
          caption: caption,
          access_token: accessToken,
        }),
      }
    );

    if (!createMediaResponse.ok) {
      const error = await createMediaResponse.json();
      console.error('❌ Erreur création média:', error);
      return NextResponse.json(
        { success: false, error: 'Erreur lors de la création du média', details: error },
        { status: createMediaResponse.status }
      );
    }

    const mediaData = await createMediaResponse.json();
    const creationId = mediaData.id;

    console.log('✅ Média créé:', creationId);

    // ÉTAPE 2: Publier le conteneur média
    const publishResponse = await fetch(
      `https://graph.facebook.com/v18.0/${instagramAccountId}/media_publish`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          creation_id: creationId,
          access_token: accessToken,
        }),
      }
    );

    if (!publishResponse.ok) {
      const error = await publishResponse.json();
      console.error('❌ Erreur publication:', error);
      return NextResponse.json(
        { success: false, error: 'Erreur lors de la publication', details: error },
        { status: publishResponse.status }
      );
    }

    const publishData = await publishResponse.json();

    console.log('✅ Post publié sur Instagram:', publishData.id);

    return NextResponse.json({
      success: true,
      postId: publishData.id,
      message: 'Post publié avec succès sur Instagram',
    });
  } catch (error) {
    console.error('❌ Erreur publication Instagram:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Erreur serveur lors de la publication Instagram',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    );
  }
}

/**
 * GET - Récupère le statut de connexion Instagram
 */
export async function GET(request: Request) {
  try {
    // Récupérer le token depuis les variables d'environnement ou la base de données
    const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
    const instagramAccountId = process.env.INSTAGRAM_ACCOUNT_ID;

    if (!accessToken || !instagramAccountId) {
      return NextResponse.json({
        success: false,
        connected: false,
        message: 'Configuration Instagram manquante',
      });
    }

    // Vérifier la validité du token
    const response = await fetch(
      `https://graph.facebook.com/v18.0/${instagramAccountId}?fields=username,profile_picture_url&access_token=${accessToken}`
    );

    if (!response.ok) {
      return NextResponse.json({
        success: false,
        connected: false,
        message: 'Token Instagram invalide ou expiré',
      });
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      connected: true,
      username: data.username,
      profilePicture: data.profile_picture_url,
    });
  } catch (error) {
    console.error('❌ Erreur vérification Instagram:', error);
    return NextResponse.json({
      success: false,
      connected: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue',
    });
  }
}
