const axios = require('axios');
require('dotenv').config();

module.exports = async (req, res) => {
  // CORS headers are now handled by Vercel.json, so we can remove them from here

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
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
      res.status(200).json({ analysis });
    } catch (error) {
      console.error('Error occurred:', error);
      
      let errorMessage = 'An error occurred while processing your request';
      let errorDetails = {};
      if (error.response) {
        errorMessage = 'Error response from OpenAI API';
        errorDetails = {
          data: error.response.data,
          status: error.response.status,
          headers: error.response.headers,
        };
      } else if (error.request) {
        errorMessage = 'No response received from OpenAI API';
        errorDetails = {
          request: error.request,
        };
      } else {
        errorMessage = 'Error setting up the request';
        errorDetails = {
          message: error.message,
        };
      }
      if (error.code === 'ECONNABORTED') {
        errorMessage = 'Request timed out';
      }
      console.error('Error details:', JSON.stringify(errorDetails));
      res.status(500).json({ 
        error: errorMessage, 
        details: JSON.stringify(errorDetails)
      });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
};
