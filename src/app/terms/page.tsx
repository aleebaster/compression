import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Умови використання | COMPEX",
  description: "Умови використання інтернет-магазину компресійного одягу COMPEX.",
};

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Умови використання
          </h1>
          <p className="mt-2 text-sm text-gray-500">Останнє оновлення: 1 червня 2026 р.</p>

          <div className="mt-8 space-y-8 text-gray-700 leading-relaxed">
            <section>
              <h2 className="text-xl font-semibold text-gray-900">1. Загальні умови</h2>
              <p className="mt-3">
                Ці Умови використання регулюють відносини між власником інтернет-магазину
                COMPEX (далі — &laquo;Продавець&raquo;) та Користувачем (далі — &laquo;Покупець&raquo;)
                у з&apos;вязку з використанням сайту compex.ua та придбанням товарів.
              </p>
              <p className="mt-3">
                Здійснюючи замовлення на нашому сайті, Ви підтверджуєте, що ознайомилися з цими
                Умовами та приймаєте їх.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900">2. Оформлення замовлення</h2>
              <ul className="mt-3 list-disc space-y-2 pl-5">
                <li>Замовлення оформляється на сайті 24/7</li>
                <li>Після оформлення з Вами зв&apos;яжеться менеджер для підтвердження</li>
                <li>Ціни на сайті вказані в гривнях (₴) та включають ПДВ</li>
                <li>Продавець залишає за собою право змінювати ціни без попереднього повідомлення</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900">3. Оплата</h2>
              <ul className="mt-3 list-disc space-y-2 pl-5">
                <li>Онлайн-оплата через LiqPay або Monobank</li>
                <li>Оплата при отриманні (накладений платіж через Нову Пошту)</li>
                <li>Безготівковий розрахунок для юридичних осіб</li>
                <li>Замовлення резервується на 48 годин після підтвердження</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900">4. Доставка</h2>
              <p className="mt-3">
                Доставка здійснюється по всій Україні через Нову Пошту або Укрпошту.
                Терміни та вартість доставки залежать від обраного способу.
                Детальніше на сторінці &laquo;Доставка та оплата&raquo;.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900">5. Повернення та обмін</h2>
              <ul className="mt-3 list-disc space-y-2 pl-5">
                <li>
                  Повернення або обмін товару можливий протягом 14 днів з моменту отримання
                </li>
                <li>
                  Товар повинен бути без слідів використання, з оригінальною упаковкою та бирками
                </li>
                <li>
                  Вартість доставки при поверненні оплачує покупець
                </li>
                <li>
                  Гроші повертаються на картку протягом 3–5 робочих днів
                </li>
                <li>
                  Обмін можливий за наявності аналогічного товару на складі
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900">6. Гарантія</h2>
              <p className="mt-3">
                На всі товари поширюється гарантія виробника. Гарантійний термін зазначається
                в описі кожного товару. Гарантія не поширюється на пошкодження, спричинені
                неправильним використанням.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900">7. Відповідальність</h2>
              <p className="mt-3">
                Продавець не несе відповідальності за затримки доставки, спричинені
                кур&apos;єрськими службами. Ризик втрати або пошкодження товару переходить до
                Покупця з моменту отримання товару.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900">8. Зміна умов</h2>
              <p className="mt-3">
                Продавець залишає за собою право змінювати ці Умови в будь-який час. Зміни
                набувають чинності з моменту публікації на сайті. Рекомендуємо періодично
                перевіряти цю сторінку.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900">9. Контакти</h2>
              <p className="mt-3">За будь-яких питань звертайтеся:</p>
              <ul className="mt-3 list-disc space-y-2 pl-5">
                <li>Email: info@compex.ua</li>
                <li>Телефон: +380 (XX) XXX-XX-XX</li>
              </ul>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
