import { NextRequest, NextResponse } from "next/server";
import type { EmailConfig } from "@/lib/email";
import { defaultEmailConfig } from "@/lib/email";

interface AdminSettings {
  storeName: string;
  storeEmail: string;
  storePhone: string;
  storeAddress: string;
  emailConfig: EmailConfig;
}

const settings: AdminSettings = {
  storeName: "COMPEX Store",
  storeEmail: "info@compex.ua",
  storePhone: "+380 67 123 4567",
  storeAddress: "м. Київ, вул. Спортивна, 1",
  emailConfig: { ...defaultEmailConfig },
};

export async function GET() {
  try {
    return NextResponse.json(settings);
  } catch {
    return NextResponse.json(
      { error: "Failed to load settings" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    Object.assign(settings, body);
    console.log("[SETTINGS] Updated:", settings);
    return NextResponse.json({ success: true, settings });
  } catch {
    return NextResponse.json(
      { error: "Failed to save settings" },
      { status: 500 }
    );
  }
}
