import { NextResponse } from "next/server";

export async function OPTIONS() {
  return NextResponse.json(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

export async function POST(request: Request) {
  try {
    const { text, targetLanguage } = await request.json();
    const apiKey = process.env.GOOGLE_CLOUD_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "APIキーが設定されていません" }, { status: 500 });
    }

    const url = new URL("https://translation.googleapis.com/language/translate/v2");
    url.searchParams.append("key", apiKey);

    const response = await fetch(url.toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        q: text,
        target: targetLanguage,
        format: "text",
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.error?.message || "翻訳APIの呼び出しに失敗しました" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json({ translation: data.data.translations[0].translatedText });
  } catch (error) {
    console.error("Error in /api/translate:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
