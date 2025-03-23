import Link from "next/link";

const Footer = () => {
  return (
    <footer className="h-32 flex flex-col items-center justify-center text-gray-700 max-xl:pb-8">
      <nav className="mb-2 flex space-x-6 max-xl:flex-col max-xl:text-center">
        <Link href="/login" className="hover:underline">
          Logowanie
        </Link>
        <Link href="/webapp" className="hover:underline">
          FishDex
        </Link>
        <Link href="/register" className="hover:underline">
          Rejestracja
        </Link>
        <Link href="/privacy-policy" className="hover:underline">
          Polityka prywatności
        </Link>
      </nav>
      <p className="text-sm">
        &copy; {new Date().getFullYear()} FishDecks. Wszelkie prawa zastrzeżone.
      </p>
      <p className="text-sm">
        Stronę stworzył{" "}
        <Link
          href="https://github.com/pietras333"
          target="_blank"
          className="text-blue-600 hover:underline"
        >
          Piotr Wendt
        </Link>
      </p>
    </footer>
  );
};

export default Footer;
