/**
 * Root layout minimal — requis par Next.js 15 pour not-found.tsx
 * Le vrai layout est dans app/[locale]/layout.tsx
 * On retourne juste children pour eviter un double <html><body> (hydratation)
 *
 * @author Lalou
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
