import ToilesContent from "@/components/toiles/ToilesContent";
import toiles from "@/data/toiles.json";
import VipExitButton from "./VipExitButton";

/**
 * Vue privee VIP rendue cote serveur quand `getAccessLevel()` retourne
 * `secret` ou `hidden`. Header epure (logo "Guillaume Farré" + bouton
 * "Sortir") puis la galerie des toiles via le composant `ToilesContent`
 * deja existant — meme code que `/toiles`, mais ici on force l'affichage
 * des prix par defaut (le cookie HMAC valide entitle l'invite a les voir).
 *
 * Le bouton Sortir POST `/api/vip/logout`, ce qui ecrase le cookie HMAC
 * et fait basculer la prochaine evaluation cote serveur vers la porte
 * d'entree `VipDoorEntry`.
 *
 * `showPrices` peut etre passe a `false` par la page parente si le cookie
 * porte un niveau `hidden` (toutes oeuvres mais pas de prix) — actuellement
 * seuls les codes `secret` existent en pratique mais le contrat est
 * preserve pour ne pas bloquer une future segmentation.
 *
 * @author Lalou
 */

interface VipPrivateViewProps {
  showPrices?: boolean;
}

export default function VipPrivateView({
  showPrices = true,
}: VipPrivateViewProps) {
  return (
    <main className="min-h-screen">
      <header className="sticky top-0 z-40 bg-background/85 backdrop-blur-md border-b border-border/40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <span className="text-xl sm:text-2xl font-extralight tracking-[0.08em]">
              GUILLAUME FARRÉ
            </span>
            <VipExitButton />
          </div>
        </div>
      </header>
      <ToilesContent toiles={toiles} showPrices={showPrices} />
    </main>
  );
}
