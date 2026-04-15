import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import nodemailer from 'nodemailer';
import { isRateLimited, getClientIP } from "@/lib/rate-limit";
import { getResendClient, FROM_EMAIL } from "@/lib/resend/client";

const CONTACTS_FILE = path.join(process.cwd(), "data", "contacts.json");

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  read: boolean;
}

async function loadContacts(): Promise<ContactMessage[]> {
  try {
    const data = await fs.readFile(CONTACTS_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function saveContacts(contacts: ContactMessage[]): Promise<void> {
  const dir = path.dirname(CONTACTS_FILE);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(CONTACTS_FILE, JSON.stringify(contacts, null, 2));
}

/**
 * Valide format email (simple regex)
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Sanitize input : retire HTML tags et caractères dangereux
 */
function sanitizeInput(input: string): string {
  return input
    .replace(/<[^>]*>/g, '') // Retirer tags HTML
    .replace(/[<>'"]/g, '') // Retirer caractères dangereux
    .trim()
    .slice(0, 10000); // Limite longueur (anti DoS)
}

/**
 * POST /api/contact - Enregistre un nouveau message de contact
 *
 * Rate limit: 5 requêtes par IP par minute
 * Input sanitization: retire HTML tags, valide email
 *
 * @author Lalou
 * @date 2025-01-20
 */
export async function POST(request: NextRequest) {
  try {
    // Rate limiting: 5 requêtes par IP par minute
    const clientIP = getClientIP(request);
    const rateLimitKey = `contact:${clientIP}`;

    if (isRateLimited(rateLimitKey, 5, 60000)) {
      return NextResponse.json(
        { error: "Trop de requêtes. Veuillez réessayer dans 1 minute." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { name, email, subject, message } = body;

    // Validation présence champs
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "Tous les champs sont requis" },
        { status: 400 }
      );
    }

    // Validation email format
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: "Format email invalide" },
        { status: 400 }
      );
    }

    // Sanitize inputs (anti XSS)
    const sanitizedName = sanitizeInput(name);
    const sanitizedSubject = sanitizeInput(subject);
    const sanitizedMessage = sanitizeInput(message);

    const contacts = await loadContacts();

    const newContact: ContactMessage = {
      id: `contact_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: sanitizedName,
      email: email.trim().toLowerCase(),
      subject: sanitizedSubject,
      message: sanitizedMessage,
      createdAt: new Date().toISOString(),
      read: false,
    };

    contacts.unshift(newContact);
    await saveContacts(contacts);

    // Envoyer l'email (ne bloque pas si echec)
    try {
      const emailHtml = `<h3>Nouveau message depuis guillaumefarre.com</h3>
        <p><strong>De:</strong> ${sanitizedName}</p>
        <p><strong>Email:</strong> ${email.trim().toLowerCase()}</p>
        <p><strong>Sujet:</strong> ${sanitizedSubject}</p>
        <hr/>
        <p>${sanitizedMessage.replace(/\n/g, '<br/>')}</p>`;

      const resend = getResendClient();
      if (resend) {
        await resend.emails.send({
          from: FROM_EMAIL,
          to: 'contact@guillaumefarre.com',
          replyTo: email.trim().toLowerCase(),
          subject: `[Site] Contact: ${sanitizedSubject}`,
          html: emailHtml,
        });
      } else {
        // Fallback: postfix local (pas d'auth)
        const transporter = nodemailer.createTransport({
          host: '127.0.0.1',
          port: 25,
          secure: false,
          tls: { rejectUnauthorized: false },
        });
        await transporter.sendMail({
          from: 'noreply@guillaumefarre.com',
          to: 'contact@guillaumefarre.com',
          replyTo: email.trim().toLowerCase(),
          subject: `[Site] Contact: ${sanitizedSubject}`,
          html: emailHtml,
        });
      }
    } catch (emailError) {
      // Email non envoyé mais message sauvegardé quand même
      console.error('Erreur envoi email (message sauvegardé):', emailError);
    }

    return NextResponse.json({ success: true, id: newContact.id });
  } catch (error) {
    console.error("Erreur enregistrement contact:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'enregistrement" },
      { status: 500 }
    );
  }
}

// Lalou
