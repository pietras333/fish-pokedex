export const metadata = {
  title: "Logowanie | Fish Pokedex 🎣",
  description:
    "Zaloguj się do Fish Pokedex i śledź swoje rekordowe połowy oraz odkrywaj nowe gatunki ryb!",
  robots: "index, follow", // Zezwolenie na indeksowanie
  openGraph: {
    title: "Logowanie | Fish Pokedex 🎣",
    description:
      "Uzyskaj dostęp do swojego konta w Fish Pokedex i śledź swoje połowy oraz rekordy.",
    url: "https://www.fishpokedex.com/login",
    siteName: "Fish Pokedex",
    type: "website",
    images: [
      {
        url: "https://www.fishpokedex.com/og-login.jpg",
        width: 1200,
        height: 630,
        alt: "Fish Pokedex - Logowanie do aplikacji",
      },
    ],
  },
};

export default function LoginLayout({ children }) {
  return <>{children}</>;
}
