export const metadata = {
  title: "Rejestracja | Fish Pokedex 🎣",
  description:
    "Załóż konto w Fish Pokedex i zacznij śledzić swoje połowy! Dołącz do społeczności wędkarzy i buduj swoją kolekcję ryb.",
  robots: "index, follow", // Zezwolenie na indeksowanie
  openGraph: {
    title: "Rejestracja | Fish Pokedex 🎣",
    description:
      "Zarejestruj się w Fish Pokedex, aby śledzić swoje połowy i konkurować z innymi wędkarzami!",
    url: "https://www.fishpokedex.com/register",
    siteName: "Fish Pokedex",
    type: "website",
    images: [
      {
        url: "https://www.fishpokedex.com/og-register.jpg",
        width: 1200,
        height: 630,
        alt: "Fish Pokedex – Dołącz już dziś!",
      },
    ],
  },
};

export default function RegisterLayout({ children }) {
  return <>{children}</>;
}
