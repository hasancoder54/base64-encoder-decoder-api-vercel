import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, text } = body;

    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Geçerli bir metin (text) parametresi gereklidir.' }, { status: 400 });
    }

    if (action === 'encode') {
      const encoded = Buffer.from(text, 'utf-8').toString('base64');
      return NextResponse.json({ success: true, result: encoded });
    } 
    
    if (action === 'decode') {
      const decoded = Buffer.from(text, 'base64').toString('utf-8');
      return NextResponse.json({ success: true, result: decoded });
    }

    return NextResponse.json({ error: 'Geçersiz işlem (action). Yalnızca "encode" veya "decode" kullanılabilir.' }, { status: 400 });

  } catch (error) {
    return NextResponse.json({ error: 'Sunucu tarafında bir hata oluştu.' }, { status: 500 });
  }
}
