addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  if (request.method !== 'POST') {
    return new Response('Método não permitido', { status: 405 })
  }

  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }

  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const requestData = await request.json()
    const apiKey = 'YOUR_OPENAI_API_KEY_HERE'
    const apiUrl = 'https://api.openai.com/v1/chat/completions'

    const openAIResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: requestData.messages,
        temperature: 0.7,
        max_tokens: 1000
      })
    })

    const openAIData = await openAIResponse.json()

    if (openAIData.error) {
      throw new Error(openAIData.error.message)
    }

    const content = openAIData.choices[0].message.content

    return new Response(JSON.stringify({ content }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    })
  }
}