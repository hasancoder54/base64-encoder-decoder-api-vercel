export default function handler(req, res) {
  // CORS ayarları (farklı sitelerden API'ne istek atılabilmesi için)
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Bu endpoint yalnızca POST isteklerini kabul eder.' });
  }

  const { action, text } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'İşlenecek metin (text) bulunamadı.' });
  }

  try {
    if (action === 'encode') {
      const encoded = Buffer.from(text, 'utf-8').toString('base64');
      return res.status(200).json({ success: true, result: encoded });
    } 
    
    if (action === 'decode') {
      const decoded = Buffer.from(text, 'base64').toString('utf-8');
      return res.status(200).json({ success: true, result: decoded });
    }

    return res.status(400).json({ error: 'Geçersiz eylem (action). Yalnızca "encode" veya "decode" kullanılabilir.' });
  } catch (error) {
    return res.status(500).json({ error: 'Sunucu tarafında kodlama/çözme işlemi sırasında hata oluştu.' });
  }
}
