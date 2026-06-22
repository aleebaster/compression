import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Таблиця розмірів",
  description: "Таблиця розмірів компресійного одягу. Як визначити правильний розмір.",
};

const sizeData = [
  { size: "S", chest: "86–90", waist: "71–75", hips: "86–90" },
  { size: "M", chest: "91–95", waist: "76–80", hips: "91–95" },
  { size: "L", chest: "96–100", waist: "81–85", hips: "96–100" },
  { size: "XL", chest: "101–105", waist: "86–90", hips: "101–105" },
  { size: "XXL", chest: "106–110", waist: "91–95", hips: "106–110" },
];

const kidsSizeData = [
  { size: "XS (4–5 років)", height: "104–110", chest: "55–58" },
  { size: "S (6–7 років)", height: "116–122", chest: "59–62" },
  { size: "M (8–9 років)", height: "128–134", chest: "63–66" },
  { size: "L (10–11 років)", height: "140–146", chest: "67–70" },
  { size: "XL (12–13 років)", height: "152–158", chest: "71–74" },
];

export default function SizeGuidePage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Таблиця розмірів
          </h1>

          <div className="mt-8 space-y-10">
            {/* How to measure */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900">Як визначити свій розмір</h2>
              <p className="mt-3 text-gray-700">
                Щоб визначити правильний розмір, виміряйте об&apos;єм тіла в сантиметрах
                та порівняйте з таблицею нижче. Для найкращої компресії рекомендуємо
                обирати розмір відповідно до ваших замірів.
              </p>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-gray-700">
                <li><strong>Груди</strong> — виміряйте найширшу частину грудної клітки.</li>
                <li><strong>Талія</strong> — виміряйте найвужчу частину талії.</li>
                <li><strong>Стегна</strong> — виміряйте найширшу частину стегон.</li>
                <li><strong>Зріст</strong> — повний зріст у сантиметрах (для дитячих розмірів).</li>
              </ul>
            </section>

            {/* Adult sizes */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900">Дорослі розміри (чоловіки та жінки)</h2>
              <div className="mt-4 overflow-hidden rounded-xl border border-gray-200">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 font-medium text-gray-700">Розмір</th>
                      <th className="px-4 py-3 font-medium text-gray-700">Груди (см)</th>
                      <th className="px-4 py-3 font-medium text-gray-700">Талія (см)</th>
                      <th className="px-4 py-3 font-medium text-gray-700">Стегна (см)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {sizeData.map((row) => (
                      <tr key={row.size}>
                        <td className="px-4 py-3 font-semibold text-gray-900">{row.size}</td>
                        <td className="px-4 py-3 text-gray-600">{row.chest}</td>
                        <td className="px-4 py-3 text-gray-600">{row.waist}</td>
                        <td className="px-4 py-3 text-gray-600">{row.hips}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Kids sizes */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900">Дитячі розміри</h2>
              <div className="mt-4 overflow-hidden rounded-xl border border-gray-200">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 font-medium text-gray-700">Розмір</th>
                      <th className="px-4 py-3 font-medium text-gray-700">Зріст (см)</th>
                      <th className="px-4 py-3 font-medium text-gray-700">Груди (см)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {kidsSizeData.map((row) => (
                      <tr key={row.size}>
                        <td className="px-4 py-3 font-semibold text-gray-900">{row.size}</td>
                        <td className="px-4 py-3 text-gray-600">{row.height}</td>
                        <td className="px-4 py-3 text-gray-600">{row.chest}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Tips */}
            <section className="rounded-2xl bg-gray-50 p-6">
              <h2 className="text-xl font-semibold text-gray-900">Поради</h2>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-gray-700">
                <li>Якщо Ваші параметри знаходяться між двома розмірами, обирайте більший розмір.</li>
                <li>Для компресійного одягу краще обирати точний розмір для оптимальної підтримки.</li>
                <li>Якщо у Вас виникли сумніви, зверніться до нас за консультацією.</li>
              </ul>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
