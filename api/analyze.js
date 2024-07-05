// api/analyze.js
import { Configuration, OpenAIApi } from "openai";

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    try {
      const configuration = new Configuration({
        apiKey: process.env.OPENAI_API_KEY,
      });
      const openai = new OpenAIApi(configuration);

      const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are an SEO expert. Analyze the content of the given URL." },
          { role: "user", content: `Analyze this URL: ${url}` }
        ],
      });

      return res.status(200).json({ analysis: completion.data.choices[0].message.content });
    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ error: 'An error occurred while processing your request' });
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}
