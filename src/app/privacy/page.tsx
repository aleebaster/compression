import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Політика конфіденційності | COMPEX",
  description: "Політика конфіденційності інтернет-магазину компресійного одягу COMPEX.",
};

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Політика конфіденційності
          </h1>
          <p className="mt-2 text-sm text-gray-500">Останнє оновлення: 1 червня 2026 р.</p>

          <div className="mt-8 space-y-8 text-gray-700 leading-relaxed">
            <section>
              <h2 className="text-xl font-semibold text-gray-900">1. Загальні положення</h2>
              <p className="mt-3">
                Ця Політика конфіденційності визначає порядок збирання, використання, зберігання
                та захисту персональних даних користувачів (далі — &laquo;Користувач&raquo;)
                інтернет-магазину COMPEX, розташованого за адресою compex.ua.
              </p>
              <p className="mt-3">
                Користуючись послугами нашого магазину, Ви підтверджуєте свою згоду з умовами
                цієї Політики. Якщо Ви не згодні з умовами, будь ласка, припиніть використання
                сайту.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900">2. Які дані ми збираємо</h2>
              <ul className="mt-3 list-disc space-y-2 pl-5">
                <li>Ім&apos;я та прізвище</li>
                <li>Адреса електронної пошти</li>
                <li>Номер телефону</li>
                <li>Адреса доставки</li>
                <li>Інформація про замовлення та покупки</li>
                <li>IP-адреса та дані про пристрій (для забезпечення безпеки)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900">3. Як ми використовуємо дані</h2>
              <ul className="mt-3 list-disc space-y-2 pl-5">
                <li>Обробка та виконання Ваших замовлень</li>
                <li>Зв&apos;язок з Вами щодо статусу замовлення</li>
                <li>Надання підтримки клієнтам</li>
                <li>Покращення якості обслуговування</li>
                <li>Надсилання інформаційних розсилок (за Вашою згодою)</li>
                <li>Забезпечення безпеки та запобігання шахрайству</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900">4. Захист даних</h2>
              <p className="mt-3">
                Ми вживаємо відповідних технічних та організаційних заходів для захисту Ваших
                персональних даних від несанкціонованого доступу, зміни, розголошення або
                знищення. Ваші дані передаються через захищене з&apos;єднання (SSL).
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900">5. Передача даних третім особам</h2>
              <p className="mt-3">
                Ми не продаємо та не передаємо Ваші персональні дані третім особам, за
                винятком випадків, коли це необхідно для виконання замовлення (кур&apos;єрські
                служби, платіжні системи).
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900">6. Ваші права</h2>
              <p className="mt-3">Ви маєте право:</p>
              <ul className="mt-3 list-disc space-y-2 pl-5">
                <li>Отримати доступ до своїх персональних даних</li>
                <li>Вимагати виправлення неточних даних</li>
                <li>Вимагати видалення своїх даних</li>
                <li>Відмовитися від отримання розсилок</li>
                <li>Подати скаргу до контролюючого органу</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900">7. Файли cookie</h2>
              <p className="mt-3">
                Наш сайт використовує файли cookie для покращення користувацького досвіду,
                аналізу трафіку та персоналізації контенту. Ви можете налаштувати свій браузер
                для відмови від cookie, але це може обмежити функціональність сайту.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900">8. Контакти</h2>
              <p className="mt-3">
                Якщо у Вас виникли питання щодо цієї Політики конфіденційності, зв&apos;яжіться
                з нами:
              </p>
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
