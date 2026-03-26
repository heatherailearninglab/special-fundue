// netlify/functions/casey.js
const OpenAI = require('openai');

exports.handler = async (event) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { prompt } = JSON.parse(event.body);
  if (!prompt) {
    return { statusCode: 400, body: 'Missing prompt' };
  }

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `You are Casey, a supportive AI guide that improves prompts using the FOCUS and READY frameworks. 
          Always respond with a helpful, improved version of the user's prompt, explaining briefly what you changed.`,
        },
        {
          role: 'user',
          content: `Improve this prompt using FOCUS and READY: ${prompt}`,
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const improved = completion.choices[0].message.content;
    return {
      statusCode: 200,
      body: JSON.stringify({ improved }),
    };
  } catch (error) {
    console.error('OpenAI error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Casey is having trouble. Check API key or try again later.' }),
    };
  }
};
