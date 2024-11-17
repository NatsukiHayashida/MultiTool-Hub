import { NextResponse } from 'next/server';

interface RequestBody {
  text: string;
  targetLanguage: string;
}

// HTML エンティティをデコードする関数
function decodeHtmlEntities(str: string): string {
  return str.replace(/&#(\d+);/g, (match, dec) => String.fromCharCode(dec))
            .replace(/&quot;/g, '"')
            .replace(/&apos;/g, "'")
            .replace(/&amp;/g, '&');
}

export async function POST(request: Request) {
  try {
    // リクエストデータのログ
    const { text, targetLanguage }: RequestBody = await request.json();
    console.log('Request payload:', { text, targetLanguage });

    // 環境変数の確認
    const apiKey = process.env.GOOGLE_CLOUD_API_KEY;
    if (!apiKey) {
      console.error('Error: APIキーが設定されていません');
      return NextResponse.json({ error: 'APIキーが設定されていません' }, { status: 500 });
    }

    const url = new URL('https://translation.googleapis.com/language/translate/v2');
    url.searchParams.append('key', apiKey);

    // API 呼び出し
    const response = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: text,
        target: targetLanguage,
        format: 'text',
      }),
    });

    // レスポンスのステータスとボディをログ出力
    console.log('Response status:', response.status);
    const responseBody = await response.clone().json();
    console.log('Google API Response:', responseBody);

    // エラーハンドリング
    if (!response.ok) {
      console.error('API Error:', responseBody.error);
      return NextResponse.json(
        { error: responseBody.error?.message || '翻訳APIの呼び出しに失敗しました' },
        { status: response.status }
      );
    }

    const data = responseBody;

    // 翻訳結果のデコード
    const rawTranslation = data.data.translations?.[0]?.translatedText || '';
    const decodedTranslation = decodeHtmlEntities(rawTranslation);

    return NextResponse.json({ translation: decodedTranslation });
  } catch (error) {
    // エラーの型を確認してログ出力
    if (error instanceof Error) {
      console.error('Error during translation:', error.message, error.stack);
      return NextResponse.json({ error: error.message || '翻訳中にエラーが発生しました' }, { status: 500 });
    } else {
      console.error('Unknown error during translation:', error);
      return NextResponse.json({ error: '未知のエラーが発生しました' }, { status: 500 });
    }
  }
}
