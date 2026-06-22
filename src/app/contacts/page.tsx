import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

export const metadata = {
  title: "Контакти",
  description: "Контактна інформація інтернет-магазину компресійного одягу.",
};

const contactItems = [
  {
    icon: Phone,
    title: "Телефон",
    details: ["+380 (44) 123-45-67", "+380 (67) 123-45-67"],
  },
  {
    icon: Mail,
    title: "Електронна пошта",
    details: ["info@example.com", "support@example.com"],
  },
  {
    icon: MapPin,
    title: "Адреса",
    details: ["м. Київ, вул. Хрещатик, 22", "Індекс: 01001"],
  },
  {
    icon: Clock,
    title: "Години роботи",
    details: ["Пн–Пт: 09:00 – 18:00", "Сб–Нд: вихідні"],
  },
];

export default function ContactsPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Контакти
          </h1>

          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {contactItems.map((item) => (
              <div
                key={item.title}
                className="flex items-start gap-4 rounded-2xl border border-gray-200 p-6"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#E31837]/10 text-[#E31837]">
                  <item.icon className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {item.title}
                  </h2>
                  <ul className="mt-2 space-y-1">
                    {item.details.map((detail) => (
                      <li key={detail} className="text-gray-600">
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-2xl bg-gray-50 p-6">
            <h2 className="text-xl font-semibold text-gray-900">Зворотній зв&apos;язок</h2>
            <p className="mt-3 text-gray-700">
              Якщо у Вас виникли питання або пропозиції, зв&apos;яжіться з нами будь-яким
              зручним способом. Ми завжди раді допомогти та відповісти на Ваші запитання.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
