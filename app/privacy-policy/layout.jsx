export const metadata = {
  title: "Polityka Prywatności | Fish Pokedex 🎣",
  description:
    "Zapoznaj się z naszą polityką prywatności, aby dowiedzieć się, jak chronimy Twoje dane w aplikacji Fish Pokedex.",
  robots: "index, follow", // Zezwolenie na indeksowanie
  openGraph: {
    title: "Polityka Prywatności | Fish Pokedex 🎣",
    description:
      "Sprawdź, jakie dane zbieramy i jak je wykorzystujemy w Fish Pokedex. Dbamy o Twoją prywatność!",
    url: "https://www.fishpokedex.com/privacy-policy",
    siteName: "Fish Pokedex",
    type: "website",
    images: [
      {
        url: "https://www.fishpokedex.com/og-privacy.jpg",
        width: 1200,
        height: 630,
        alt: "Fish Pokedex – Twoja prywatność jest dla nas ważna",
      },
    ],
  },
};

export default function PrivacyPolicyLayout({ children }) {
  return <>{children}</>;
}
