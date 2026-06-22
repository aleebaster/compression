import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Search } from "lucide-react";

export const metadata = {
  title: "Пошук",
  description: "Пошук товарів у магазині компресійного одягу.",
};

export default function SearchPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Пошук
          </h1>

          <div className="mt-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Введіть запит для пошуку товарів"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-12 pr-4 text-gray-900 placeholder-gray-400 transition-colors focus:border-[#E31837] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#E31837]"
              />
            </div>

            <p className="mt-6 text-center text-gray-500">
              Введіть запит для пошуку товарів
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
