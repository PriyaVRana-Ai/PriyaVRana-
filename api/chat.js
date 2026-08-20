export default async function handler(req, res) {
  if (req.method!== 'POST') return res.status(405).json({error: 'Method not allowed'});
  
  try {
    const { prompt } = req.body; // JSON.parse हटा दिया
    const API_KEY = process.env.GEMINI_API_KEY;

    if (!prompt) return res.status(400).json({ error: 'Prompt missing' });

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        contents: [{ parts: [{ text: `तुम PriyaVRana-Ai हो। हिंदी में प्यार से और छोटा जवाब दो। सवाल: ${prompt}` }] }] 
      })
    });
    
    const data = await response.json();
    
    // Safe check लगा दिया
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "माफ करना, मैं अभी जवाब नहीं दे पाई।";
    
    res.status(200).json({ reply });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'AI se baat nahi ho pa rahi: ' + error.message });
  }
}