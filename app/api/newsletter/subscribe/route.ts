import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const SUBSCRIBERS_FILE = path.join(process.cwd(), 'data', 'newsletter-subscribers.json');
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Rate limiting simple en memoire
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute

function getClientIP(request: NextRequest): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0] ||
         request.headers.get('x-real-ip') ||
         'unknown';
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }

  if (record.count >= RATE_LIMIT_MAX) {
    return false;
  }

  record.count++;
  return true;
}

interface Subscriber {
  email: string;
  date: string;
  ip: string;
  locale: string;
}

/**
 * API d'inscription newsletter pour landing Coming Soon
 *
 * POST /api/newsletter/subscribe
 * Body: { email: string, locale?: string }
 *
 * Validation email, rate limiting, stockage JSON
 *
 * @author Lalou
 */
export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = getClientIP(request);
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Trop de requêtes. Veuillez réessayer dans une minute.' },
        { status: 429 }
      );
    }

    // Parse body
    const body = await request.json();
    const { email, locale = 'fr' } = body;

    // Validation email
    if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { error: 'Adresse email invalide' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Lire le fichier (ou créer si inexistant)
    let subscribers: Subscriber[] = [];
    try {
      const fileContent = await fs.readFile(SUBSCRIBERS_FILE, 'utf-8');
      subscribers = JSON.parse(fileContent);
    } catch (error) {
      // Fichier n'existe pas, on part avec tableau vide
      subscribers = [];
    }

    // Vérifier doublon
    const exists = subscribers.some(sub => sub.email === normalizedEmail);
    if (exists) {
      // Pas d'erreur, on renvoie success (comportement silencieux)
      return NextResponse.json({ success: true });
    }

    // Ajouter nouveau subscriber
    const newSubscriber: Subscriber = {
      email: normalizedEmail,
      date: new Date().toISOString(),
      ip,
      locale,
    };

    subscribers.push(newSubscriber);

    // Créer le dossier data si inexistant
    await fs.mkdir(path.dirname(SUBSCRIBERS_FILE), { recursive: true });

    // Sauvegarder
    await fs.writeFile(
      SUBSCRIBERS_FILE,
      JSON.stringify(subscribers, null, 2),
      'utf-8'
    );

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Erreur API newsletter subscribe:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue. Veuillez réessayer.' },
      { status: 500 }
    );
  }
}
