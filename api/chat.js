export default async function handler(req, res) {
  if (req.method!== 'POST') return res.status(405).json({ reply: 'Method not allowed' });

  try {
    const body = typeof req.body === 'string'? JSON.parse(req.body) : req.body;
    const { prompt } = body;
    const API_KEY = process.env.GEMINI_API_KEY;

    if (!API_KEY) return res.status(500).json({ reply: 'Error: GEMINI_API_KEY Vercel me add nahi hai' });

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, // v1 कर दिया
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          contents: [{ parts: [{ text: `तुम PriyaVRana-Ai हो। हिंदी में प्यार से और छोटा जवाब दो। सवाल: ${prompt}` }] 
        })
      }
    );
    
    const data = await response.json();
    if (data.error) return res.status(500).json({ reply: 'Google API Error: ' + data.error.message });
    
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "माफ करना, मैं अभी जवाब नहीं दे पाई।";
    res.status(200).json({ reply });

  } catch (error) {
    res.status(500).json({ reply: 'Server Error: ' + error.message });
  }
}