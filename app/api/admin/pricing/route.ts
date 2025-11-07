import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { DEFAULT_PRICING, type PricingConfig } from '@/lib/pricing-config';

/**
 * API routes pricing Guillaume Farré
 *
 * @author Lalou
 * @date 2025-11-08
 *
 * GET /api/admin/pricing - Récupérer config actuelle
 * POST /api/admin/pricing - Sauvegarder nouvelle config
 */

const PRICING_FILE = path.join(process.cwd(), 'data', 'pricing-config.json');

/**
 * Récupère la configuration pricing actuelle
 */
export async function GET() {
  try {
    // Lire fichier config si existe
    const fileContent = await fs.readFile(PRICING_FILE, 'utf-8');
    const config: PricingConfig = JSON.parse(fileContent);

    return NextResponse.json({
      success: true,
      config,
    });
  } catch (error) {
    // Si fichier n'existe pas, retourner config par défaut
    console.log('Config pricing non trouvée, utilisation config par défaut');

    return NextResponse.json({
      success: true,
      config: DEFAULT_PRICING,
    });
  }
}

/**
 * Sauvegarde une nouvelle configuration pricing
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { config } = body;

    if (!config) {
      return NextResponse.json({ success: false, error: 'Config manquante' }, { status: 400 });
    }

    // Valider structure config
    if (
      typeof config.prixBaseUnlimited !== 'number' ||
      typeof config.prixBaseLimited !== 'number' ||
      !config.multipliersUnlimited ||
      !config.multipliersLimited
    ) {
      return NextResponse.json({ success: false, error: 'Config invalide' }, { status: 400 });
    }

    // Créer dossier data si n'existe pas
    const dataDir = path.dirname(PRICING_FILE);
    try {
      await fs.access(dataDir);
    } catch {
      await fs.mkdir(dataDir, { recursive: true });
    }

    // Sauvegarder config avec timestamp
    const configToSave: PricingConfig = {
      ...config,
      lastUpdated: new Date().toISOString(),
    };

    await fs.writeFile(PRICING_FILE, JSON.stringify(configToSave, null, 2), 'utf-8');

    return NextResponse.json({
      success: true,
      config: configToSave,
    });
  } catch (error: any) {
    console.error('Erreur sauvegarde config pricing:', error);

    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Erreur serveur',
      },
      { status: 500 }
    );
  }
}
