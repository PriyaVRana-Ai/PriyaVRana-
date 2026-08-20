export default async function handler(req, res) {
  if (req.method!== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { prompt } = req.body;
    const API_KEY = process.env.GEMINI_API_KEY;

    if (!API_KEY) {
      return res.status(500).json({ error: 'GEMINI_API_KEY Vercel में नहीं लगी है' });
    }
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt missing' });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `तुम PriyaVRana-Ai हो। तुम हिंदी में प्यार से, दोस्ताना और छोटा जवाब देती हो। जवाब 3-4 लाइन से ज्यादा नहीं। सवाल: ${prompt}`
            }]
          }]
        })
      }
    );

    const data = await response.json();

    // अगर Google से error आया तो वो दिखा दो
    if (data.error) {
      return res.status(500).json({ error: 'Google API Error: ' + data.error.message });
    }

    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "माफ करना, मैं अभी जवाब नहीं दे पाई।";

    res.status(200).json({ reply });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error: ' + error.message });
  }
}