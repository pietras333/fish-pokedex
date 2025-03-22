import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-dvh flex flex-col max-xl:gap-8">
      <Navbar />
      <section className="flex flex-col items-center justify-center flex-grow p-6 max-w-3xl mx-auto text-gray-700">
        <h1 className="text-3xl font-bold text-center text-blue-700 mb-4">
          Polityka Prywatności
        </h1>
        <p className="mb-4">
          Korzystając z aplikacji FishDecks, akceptujesz poniższe zasady
          dotyczące ochrony prywatności.
        </p>

        <h2 className="text-xl font-semibold mt-4">1. Jakie dane zbieramy?</h2>
        <p className="mb-4">
          FishDecks przechowuje następujące dane użytkowników:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>Nazwę użytkownika</li>
          <li>Zaszyfrowane hasło</li>
          <li>
            Wpisy dotyczące złowionych ryb (np. gatunek, data, lokalizacja)
          </li>
        </ul>
        <p className="mb-4">
          Nie zbieramy adresów e-mail ani innych danych osobowych.
        </p>

        <h2 className="text-xl font-semibold mt-4">
          2. Jak przechowujemy dane?
        </h2>
        <p className="mb-4">
          Hasła są przechowywane w postaci zaszyfrowanej (hashowane) i nigdy nie
          są przechowywane w postaci jawnej. Wszystkie dane, w tym wpisy o
          złowionych rybach, przechowujemy w bazie danych MongoDB.
        </p>

        <h2 className="text-xl font-semibold mt-4">
          3. Brak odpowiedzialności za wycieki danych
        </h2>
        <p className="mb-4">
          Dołożono wszelkich starań, aby zabezpieczyć dane użytkowników, jednak
          FishDecks nie ponosi odpowiedzialności za ewentualne wycieki danych
          wynikające z ataków zewnętrznych lub innych nieprzewidzianych zdarzeń.
        </p>

        <h2 className="text-xl font-semibold mt-4">
          4. Zmiany w polityce prywatności
        </h2>
        <p className="mb-4">
          Zastrzegamy sobie prawo do modyfikacji niniejszej polityki
          prywatności. Wszelkie zmiany będą publikowane na tej stronie.
        </p>

        <p className="mt-6 text-sm text-gray-500">
          Ostatnia aktualizacja: {new Date().toLocaleDateString()}
        </p>
      </section>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
