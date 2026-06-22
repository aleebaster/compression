export interface EmailConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  senderEmail: string;
  senderName: string;
}

export interface EmailMessage {
  to: string;
  subject: string;
  html: string;
}

export const defaultEmailConfig: EmailConfig = {
  host: "smtp.gmail.com",
  port: 587,
  user: "",
  password: "",
  senderEmail: "noreply@compression.shop",
  senderName: "compression_mega_shop",
};

export async function sendEmail(
  config: EmailConfig,
  message: EmailMessage
): Promise<{ success: boolean; message: string }> {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  console.log(`[EMAIL] To: ${message.to}`);
  console.log(`[EMAIL] Subject: ${message.subject}`);
  console.log(`[EMAIL] SMTP: ${config.host}:${config.port}`);
  console.log(`[EMAIL] From: ${config.senderName} <${config.senderEmail}>`);

  return { success: true, message: "Email sent successfully (simulated)" };
}

export function orderConfirmationEmail(
  orderNumber: string,
  items: string[],
  total: number
): EmailMessage {
  const itemsHtml = items.map((item) => `<li>${item}</li>`).join("");
  return {
    to: "",
    subject: `Замовлення ${orderNumber} підтверджено`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Дякуємо за замовлення!</h1>
        <p>Номер вашого замовлення: <strong>${orderNumber}</strong></p>
        <h2>Ваші товари:</h2>
        <ul>${itemsHtml}</ul>
        <p style="font-size: 18px;"><strong>Загальна сума: ${total} ₴</strong></p>
        <hr />
        <p style="color: #666;">compression_mega_shop — Компресійний одяг для спорту</p>
      </div>
    `,
  };
}

export function orderStatusEmail(
  orderNumber: string,
  status: string
): EmailMessage {
  const statusLabels: Record<string, string> = {
    NEW: "Нове",
    PROCESSING: "В обробці",
    SHIPPED: "Відправлено",
    DELIVERED: "Доставлено",
    CANCELLED: "Скасовано",
  };
  return {
    to: "",
    subject: `Статус замовлення ${orderNumber} змінено`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Оновлення статусу замовлення</h1>
        <p>Номер замовлення: <strong>${orderNumber}</strong></p>
        <p>Новий статус: <strong>${statusLabels[status] || status}</strong></p>
        <hr />
        <p style="color: #666;">compression_mega_shop — Компресійний одяг для спорту</p>
      </div>
    `,
  };
}

export function testEmail(adminEmail: string): EmailMessage {
  return {
    to: adminEmail,
    subject: "Тестовий лист compression_mega_shop",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Тестовий лист</h1>
        <p>Це тестовий лист з системи email compression_mega_shop.</p>
        <p>Якщо ви отримали цей лист, налаштування SMTP працюють правильно.</p>
        <hr />
        <p style="color: #666;">compression_mega_shop — Компресійний одяг для спорту</p>
      </div>
    `,
  };
}
