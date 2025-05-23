import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CTRL + ALT + DELIGHT',
  description: 'A modern, interactive terminal-themed portfolio website',
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