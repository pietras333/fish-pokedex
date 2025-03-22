export const metadata = {
  title: "Fish Pokedex 🎣 | Twój Dziennik Połowów",
  description:
    "Śledź swoje połowy, odkrywaj nowe gatunki ryb i rywalizuj z innymi wędkarzami. Zaloguj się i zacznij budować swoją kolekcję!",
  robots: "index, follow", // Zezwolenie na indeksowanie
  openGraph: {
    title: "Fish Pokedex 🎣 | Twój Dziennik Połowów",
    description:
      "Zapisuj swoje połowy, przeglądaj statystyki i zobacz, jakie ryby udało Ci się już złowić!",
    url: "https://www.fishpokedex.com",
    siteName: "Fish Pokedex",
    type: "website",
    images: [
      {
        url: "https://www.fishpokedex.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Fish Pokedex – Zbierz je wszystkie!",
      },
    ],
  },
};

export default function FishPokedexLayout({ children }) {
  return <>{children}</>;
}
