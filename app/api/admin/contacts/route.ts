import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { requireAdminAuth } from '@/lib/admin/auth';

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
 * GET /api/admin/contacts - Récupère tous les messages de contact
 *
 * @author Lalou
 * @date 2025-01-20
 */
export async function GET() {
  const authError = await requireAdminAuth();
  if (authError) return authError;

  try {
    const contacts = await loadContacts();
    return NextResponse.json(contacts);
  } catch (error) {
    console.error("Erreur chargement contacts:", error);
    return NextResponse.json(
      { error: "Erreur lors du chargement" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/admin/contacts - Marque un message comme lu
 *
 * @author Lalou
 * @date 2025-01-20
 */
export async function PATCH(request: NextRequest) {
  const authError = await requireAdminAuth();
  if (authError) return authError;

  try {
    const body = await request.json();
    const { id, read } = body;

    if (!id) {
      return NextResponse.json({ error: "ID requis" }, { status: 400 });
    }

    const contacts = await loadContacts();
    const index = contacts.findIndex((c) => c.id === id);

    if (index === -1) {
      return NextResponse.json({ error: "Contact non trouvé" }, { status: 404 });
    }

    contacts[index].read = read ?? true;
    await saveContacts(contacts);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur mise à jour contact:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/contacts - Supprime un message
 *
 * @author Lalou
 * @date 2025-01-20
 */
export async function DELETE(request: NextRequest) {
  const authError = await requireAdminAuth();
  if (authError) return authError;

  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: "ID requis" }, { status: 400 });
    }

    const contacts = await loadContacts();
    const filtered = contacts.filter((c) => c.id !== id);
    await saveContacts(filtered);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur suppression contact:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression" },
      { status: 500 }
    );
  }
}
