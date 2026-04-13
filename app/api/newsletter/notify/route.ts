import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { requireAdminAuth } from '@/lib/admin/auth';

const SUBSCRIBERS_FILE = path.join(process.cwd(), 'data', 'newsletter-subscribers.json');
const LAST_NOTIFY_FILE = path.join(process.cwd(), 'data', 'newsletter-last-notify.json');
const MIN_INTERVAL_MS = 60 * 60 * 1000; // 1 heure entre notifications

interface Subscriber {
  email: string;
  date: string;
  ip: string;
  locale: string;
}

interface NotifyBody {
  title: string;
  description: string;
  imageUrl?: string;
  linkUrl?: string;
}

function buildEmailHtml(body: NotifyBody): string {
  const siteUrl = 'https://guillaumefarre.com';
  const link = body.linkUrl || siteUrl;

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#FEFEFA;font-family:Georgia,serif;">
  <div style="max-width:600px;margin:0 auto;padding:40px 24px;">
    <h1 style="font-size:22px;font-weight:300;color:#1a1a1a;margin:0 0 16px;">
      ${body.title}
    </h1>
    <p style="font-size:15px;line-height:1.6;color:#444;margin:0 0 24px;">
      ${body.description}
    </p>
    ${body.imageUrl ? `<img src="${body.imageUrl}" alt="${body.title}" style="width:100%;max-width:500px;height:auto;margin:0 0 24px;display:block;" />` : ''}
    <a href="${link}" style="display:inline-block;padding:12px 24px;background:#1a1a1a;color:#fff;text-decoration:none;font-size:14px;font-weight:300;">
      Voir sur le site
    </a>
    <hr style="margin:40px 0 16px;border:none;border-top:1px solid #e5e5e5;" />
    <p style="font-size:12px;color:#999;margin:0;">
      Guillaume Farr&eacute; &mdash; <a href="${siteUrl}" style="color:#8c6e32;">guillaumefarre.com</a>
    </p>
    <p style="font-size:11px;color:#bbb;margin:8px 0 0;">
      Pour ne plus recevoir ces emails, r&eacute;pondez &agrave; ce message avec "STOP".
    </p>
  </div>
</body>
</html>`;
}

/**
 * API de notification newsletter (admin uniquement).
 *
 * POST /api/newsletter/notify
 * Body: { title, description, imageUrl?, linkUrl? }
 *
 * Envoie un email a tous les subscribers via Resend.
 * Rate limit: 1 notification par heure max.
 *
 * @author Lalou
 */
export async function POST(request: NextRequest) {
  // Auth admin obligatoire
  const authError = await requireAdminAuth();
  if (authError) return authError;

  try {
    // Rate limit: verifier dernier envoi
    let lastNotify = 0;
    try {
      const content = await fs.readFile(LAST_NOTIFY_FILE, 'utf-8');
      lastNotify = JSON.parse(content).timestamp || 0;
    } catch {
      // Fichier inexistant = jamais envoye
    }

    const now = Date.now();
    if (now - lastNotify < MIN_INTERVAL_MS) {
      const remainingMin = Math.ceil((MIN_INTERVAL_MS - (now - lastNotify)) / 60000);
      return NextResponse.json(
        { error: `Veuillez attendre encore ${remainingMin} minutes avant le prochain envoi.` },
        { status: 429 }
      );
    }

    // Parse body
    const body: NotifyBody = await request.json();
    if (!body.title || !body.description) {
      return NextResponse.json(
        { error: 'Titre et description requis.' },
        { status: 400 }
      );
    }

    // Lire subscribers
    let subscribers: Subscriber[] = [];
    try {
      const fileContent = await fs.readFile(SUBSCRIBERS_FILE, 'utf-8');
      subscribers = JSON.parse(fileContent);
    } catch {
      return NextResponse.json(
        { error: 'Aucun abonné trouvé.' },
        { status: 404 }
      );
    }

    if (subscribers.length === 0) {
      return NextResponse.json({ success: true, sent: 0, errors: 0 });
    }

    // Verifier RESEND_API_KEY
    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
      return NextResponse.json(
        { error: 'RESEND_API_KEY non configurée. Emails non envoyés.' },
        { status: 503 }
      );
    }

    // Import dynamique Resend pour eviter crash si pas configure
    const { Resend } = await import('resend');
    const resend = new Resend(resendApiKey);

    const html = buildEmailHtml(body);
    let sent = 0;
    let errors = 0;

    // Envoyer par batch de 10 pour eviter surcharge
    const batchSize = 10;
    for (let i = 0; i < subscribers.length; i += batchSize) {
      const batch = subscribers.slice(i, i + batchSize);
      const results = await Promise.allSettled(
        batch.map((sub) =>
          resend.emails.send({
            from: 'Guillaume Farré <noreply@guillaumefarre.com>',
            to: sub.email,
            subject: body.title,
            html,
          })
        )
      );

      for (const result of results) {
        if (result.status === 'fulfilled' && result.value.data) {
          sent++;
        } else {
          errors++;
        }
      }
    }

    // Sauvegarder timestamp dernier envoi
    await fs.mkdir(path.dirname(LAST_NOTIFY_FILE), { recursive: true });
    await fs.writeFile(
      LAST_NOTIFY_FILE,
      JSON.stringify({ timestamp: now }),
      'utf-8'
    );

    return NextResponse.json({ success: true, sent, errors });
  } catch (error) {
    console.error('Erreur API newsletter notify:', error);
    return NextResponse.json(
      { error: 'Erreur interne lors de l\'envoi.' },
      { status: 500 }
    );
  }
}

// Lalou
