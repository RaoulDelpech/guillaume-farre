import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

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
 * POST /api/contact - Enregistre un nouveau message de contact
 *
 * @author Lalou
 * @date 2025-01-20
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "Tous les champs sont requis" },
        { status: 400 }
      );
    }

    const contacts = await loadContacts();

    const newContact: ContactMessage = {
      id: `contact_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      email,
      subject,
      message,
      createdAt: new Date().toISOString(),
      read: false,
    };

    contacts.unshift(newContact);
    await saveContacts(contacts);

    return NextResponse.json({ success: true, id: newContact.id });
  } catch (error) {
    console.error("Erreur enregistrement contact:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'enregistrement" },
      { status: 500 }
    );
  }
}
