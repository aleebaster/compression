import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { RotateCcw, PackageCheck, CreditCard, HelpCircle } from "lucide-react";

export const metadata = {
  title: "Повернення та обмін",
  description: "Умови повернення та обміну товарів в інтернет-магазині компресійного одягу.",
};

const steps = [
  {
    icon: HelpCircle,
    title: "Зверніться до нас",
    description: "Зв'яжіться з нами за телефоном або електронною поштою та повідомте про бажання повернути або обміняти товар.",
  },
  {
    icon: PackageCheck,
    title: "Підготуйте товар",
    description: "Товар повинен бути без слідів використання, зберігати оригінальну упаковку та бирки.",
  },
  {
    icon: RotateCcw,
    title: "Надішліть товар",
    description: "Надішліть товар через Нову Пошту на вказану нами адресу. Вартість доставки при поверненні оплачує покупець.",
  },
  {
    icon: CreditCard,
    title: "Отримайте гроші",
    description: "Після отримання та перевірки товару гроші будуть повернені на Вашу картку протягом 3–5 робочих днів.",
  },
];

export default function ReturnsPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Повернення та обмін
          </h1>

          <div className="mt-8 space-y-8 text-gray-700 leading-relaxed">
            <p>
              Ми прагнемо, щоб кожен клієнт був задоволений своєю покупкою. Якщо з
              якоїсь причини товар Вас не підійшов, Ви можете повернути або обміняти
              його відповідно до умов, описаних нижче.
            </p>

            <section>
              <h2 className="text-xl font-semibold text-gray-900">Умови повернення</h2>
              <ul className="mt-4 list-disc space-y-2 pl-5">
                <li>Повернення або обмін товару можливий протягом <strong>14 днів</strong> з моменту отримання замовлення.</li>
                <li>Товар повинен бути без слідів використання, зберігати оригінальну упаковку та бирки.</li>
                <li>Не підлягають поверненню товари, які були у використанні або втратили свій первісний вигляд.</li>
                <li>Поверненню підлягають товари належної якості, які не підійшли за розміром, кольором або іншими характеристиками.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900">Як оформити повернення</h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {steps.map((step, index) => (
                  <div
                    key={step.title}
                    className="flex items-start gap-4 rounded-2xl border border-gray-200 p-5"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E31837]/10 text-[#E31837]">
                      <step.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        <span className="text-[#E31837]">Крок {index + 1}.</span>{" "}
                        {step.title}
                      </h3>
                      <p className="mt-1 text-sm text-gray-600">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900">Обмін товару</h2>
              <p className="mt-3">
                Обмін товару можливий за наявності аналогічного товару на складі. Якщо
                бажаного товару немає в наявності, ми запропонуємо Вам альтернативні
                варіанти або оформимо повернення грошей.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900">Повернення грошей</h2>
              <p className="mt-3">
                Гроші повертаються на картку, з якої була здійснена оплата, протягом
                <strong> 3–5 робочих днів</strong> після отримання повернення та
                підтвердження відповідності товару умовам повернення.
              </p>
            </section>

            <section className="rounded-2xl bg-gray-50 p-6">
              <h2 className="text-xl font-semibold text-gray-900">Контакти для повернення</h2>
              <p className="mt-3 text-gray-700">
                Для оформлення повернення або обміну зверніться до нас:
              </p>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-gray-700">
                <li>Телефон: +380 (44) 123-45-67</li>
                <li>Email: returns@example.com</li>
              </ul>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
