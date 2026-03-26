// netlify/functions/casey.js
exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { prompt } = JSON.parse(event.body);
  if (!prompt) {
    return { statusCode: 400, body: 'Missing prompt' };
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error('OPENAI_API_KEY missing');
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'API key not set in Netlify environment variables.' }),
    };
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
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
      }),
    });

    const data = await response.json();
    if (data.error) throw new Error(data.error.message);

    const improved = data.choices[0].message.content;
    return {
      statusCode: 200,
      body: JSON.stringify({ improved }),
    };
  } catch (err) {
    console.error('OpenAI call failed:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Casey had trouble reaching OpenAI. Please try again later.' }),
    };
  }
};
