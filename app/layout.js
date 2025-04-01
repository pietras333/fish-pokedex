import "./globals.css";
import { Inter } from "next/font/google";
import Providers from "./providers";

export const metadata = {
  title: "Fish Pokedex 🎣 | Twoje wędkarskie osiągnięcia",
  description:
    "Fish Pokedex to interaktywna aplikacja dla wędkarzy, w której możesz śledzić swoje połowy, odkrywać gatunki ryb i konkurować z innymi użytkownikami!",
  robots: "index, follow",
  openGraph: {
    title: "Fish Pokedex 🎣 | Twoje wędkarskie osiągnięcia",
    description:
      "Dołącz do Fish Pokedex, rejestruj swoje rekordowe połowy i porównuj wyniki z innymi wędkarzami!",
    url: "https://www.fishpokedex.com",
    siteName: "Fish Pokedex",
    type: "website",
    images: [
      {
        url: "https://www.fishpokedex.com/og-home.jpg",
        width: 1200,
        height: 630,
        alt: "Fish Pokedex - Interaktywna aplikacja dla wędkarzy",
      },
    ],
    locale: "pl_PL",
    languages: "pl",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="pl">
      <head>
        <link rel="icon" type="image/svg+xml" href="/images/logo.svg" />
        <link rel="apple-touch-icon" href="/images/logo.svg" />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
