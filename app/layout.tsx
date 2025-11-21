import type { Metadata } from 'next';
import './globals.css';

const title = "Machiavelli's Secret Narrative Transcript";
const description =
  'Narrative re-telling of the YouTube video “Machiavelli’s Secret — When You Stop Chasing, They Start Kneeling.”';

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    url: 'https://agentic-f10a2eab.vercel.app',
    siteName: title,
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
