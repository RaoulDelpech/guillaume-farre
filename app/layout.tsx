/**
 * Root layout minimal — requis par Next.js 15 pour not-found.tsx
 * Le vrai layout est dans app/[locale]/layout.tsx
 *
 * @author Lalou
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
