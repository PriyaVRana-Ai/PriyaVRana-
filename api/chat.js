export default async function handler(req, res) {
  if (req.method!== 'POST') return res.status(405).json({error: 'Method not allowed'});
  
  try {
    const { prompt } = JSON.parse(req.body);
    const API_KEY = process.env.GEMINI_API_KEY;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        contents: [{ parts: [{ text: `तुम PriyaVRana-Ai हो। हिंदी में प्यार से और छोटा जवाब दो। सवाल: ${prompt}` }] }] 
      })
    });
    
    const data = await response.json();
    const reply = data.candidates[0].content.parts[0].text;
    
    res.status(200).json({ reply });
  } catch (error) {
    res.status(500).json({ error: 'AI se baat nahi ho pa rahi' });
  }
}