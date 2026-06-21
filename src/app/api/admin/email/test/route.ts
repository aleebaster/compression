import { NextRequest, NextResponse } from "next/server";
import { sendEmail, testEmail, defaultEmailConfig } from "@/lib/email";
import type { EmailConfig } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { config, to } = body as { config?: EmailConfig; to: string };

    if (!to) {
      return NextResponse.json(
        { error: "Recipient email is required" },
        { status: 400 }
      );
    }

    const emailConfig = { ...defaultEmailConfig, ...config };
    const message = testEmail(to);
    const result = await sendEmail(emailConfig, message);

    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { error: "Failed to send test email" },
      { status: 500 }
    );
  }
}
