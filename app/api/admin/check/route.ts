import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin/auth";

/**
 * Verifie si la requete entrante possede un cookie admin valide.
 *
 * Utilise cote client par le hook useAdminPhotos pour savoir s'il faut
 * afficher l'ecran de login ou le tableau de bord. Le cookie `gf_admin`
 * etant HttpOnly, le client ne peut pas le lire directement.
 *
 * @author Lalou
 */
export async function GET() {
  const authenticated = await isAdminAuthenticated();
  return NextResponse.json({ authenticated });
}

// Lalou
