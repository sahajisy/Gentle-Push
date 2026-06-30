export async function generateAIResponse(promptOrMessages, maxTokens = 150) {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("API key is missing. Please add VITE_GROQ_API_KEY to your .env.local file.");
  }

  const messages = Array.isArray(promptOrMessages) 
    ? promptOrMessages 
    : [{ role: 'user', content: promptOrMessages }];

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'llama-3.1-8b-instant',
      messages: messages,
      temperature: 0.7,
      max_tokens: maxTokens
    })
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error?.message || `API error: ${response.statusText}`);
  }

  return data.choices[0].message.content.trim();
}
