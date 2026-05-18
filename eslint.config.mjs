import { FlatCompat } from "@eslint/eslintrc";
import path from "path";
import { fileURLToPath } from "url";

/**
 * ESLint flat config minimale.
 *
 * Migre depuis `next lint` (deprecated dans Next 15.5 -> prompt interactif
 * Strict/Base qui bloque l'enchainement npm/bun script). On utilise
 * eslint-config-next via FlatCompat pour conserver les regles next/core-web-vitals
 * sans avoir a tout reecrire en flat config natif (next n'expose pas encore
 * de flat config officielle au 18/05/2026).
 *
 * @author Lalou
 */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const config = [
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "public/**",
      "data/**",
      ".tmp/**",
      "coverage/**",
      "playwright-report/**",
      "test-results/**",
      "scripts/**",
      "*.log",
    ],
  },
  ...compat.extends("next/core-web-vitals"),
  {
    rules: {
      // Cosmetique pur — apostrophes/guillemets dans du JSX. 173 violations
      // pre-existantes (tous fichiers de texte FR avec apostrophes). Pas un
      // signal de bug, juste de la dette de migration. Le `next lint`
      // historique etait permissif sur ce point ; on s'aligne.
      "react/no-unescaped-entities": "off",
      // Warning plutot qu'error : permet aux fichiers existants d'utiliser
      // <a href> pour la navigation interne sans bloquer le script `lint`.
      // 6 violations actuelles ; a migrer en Link progressivement.
      "@next/next/no-html-link-for-pages": "warn",
      // Warning plutot qu'error : la majorite des import default anonymes
      // sont dans des configs/scripts ou la regle n'apporte rien.
      "import/no-anonymous-default-export": "warn",
    },
  },
];

export default config;
