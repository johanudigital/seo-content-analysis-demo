require('dotenv').config();

module.exports = async (req, res) => {
  // Simplified CORS handling
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    try {
      console.log('Starting OpenAI API call...');
      const startTime = Date.now();
      const openaiResponse = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are an SEO expert. Analyze the content of the given URL, accurately reflects the page content, and encourages clicks."
          },
          {
            role: "user",
            content: `URL: ${url}`
          }          
        ]
      }, {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 50000 // 50 seconds timeout
      });
 
      console.log(`OpenAI API call completed in ${Date.now() - startTime}ms`);
      const analysis = openaiResponse.data.choices[0].message.content;
      return res.status(200).json({ analysis });
    } catch (error) {
      console.error('Error occurred:', error);
      return res.status(500).json({ 
        error: 'An error occurred while processing your request', 
        details: error.message
      });
    }
  } else {
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
};
