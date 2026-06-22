import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Про нас",
  description: "Дізнайтеся більше про інтернет-магазин компресійного одягу.",
};

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Про нас
          </h1>

          <div className="mt-8 space-y-6 text-gray-700 leading-relaxed">
            <p>
              Це спеціалізований інтернет-магазин компресійного одягу преміум класу.
              Ми пропонуємо високоякісний компресійний одяг для дорослих та дітей, який
              забезпечує ідеальну підтримку м&apos;язів під час тренувань, відведення вологи
              та максимальний комфорт.
            </p>

            <p>
              Наш магазин був створений з метою надати спортсменам, активним людям та
              тим, хто дбає про своє здоров&apos;я, доступ до найкращого компресійного одягу
              на ринку. Ми співпрацюємо безпосередньо з виробниками, що дозволяє нам
              гарантувати оригінальність продукції та пропонувати конкурентні ціни.
            </p>

            <p>
              Наш асортимент включає компресійні шкарпетки, гольфи, штани, футболки
              та аксесуари, які підходять для різних видів спорту та повсякденного
              використання. Ми ретельно контролюємо якість кожної одиниці товару
              та пропонуємо тільки перевірену продукцію.
            </p>

            <p>
              Наша місія — зробити компресійний одяг доступним для кожного, хто
              піклується про здоров&apos;я та комфорт. Ми прагнемо надати найкращий
              сервіс, швидку доставку та професійні консультації нашим клієнтам.
            </p>

            <div className="rounded-2xl bg-gray-50 p-6">
              <h2 className="text-xl font-semibold text-gray-900">Наші цінності</h2>
              <ul className="mt-4 space-y-3">
                <li className="flex items-start gap-3">
                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#E31837]" />
                  <span><strong>Якість</strong> — ми пропонуємо тільки оригінальну продукцію від перевірених виробників.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#E31837]" />
                  <span><strong>Надійність</strong> — ми дотримуємося всіх зобов&apos;язань перед клієнтами.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#E31837]" />
                  <span><strong>Клієнтоорієнтованість</strong> — ми завжди готові допомогти та проконсультувати.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#E31837]" />
                  <span><strong>Доступність</strong> — ми пропонуємо зручні способи оплати та доставки по всій Україні.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
