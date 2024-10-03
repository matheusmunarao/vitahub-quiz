export default {
  async fetch(request, env) {
    const headers = new Headers({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    });

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers });
    }

    try {
      const reqBody = await request.json();
      console.log('Received request body:', JSON.stringify(reqBody));

      const chat = {
        messages: reqBody.messages || [],
      };

      const response = await env.AI.run('@cf/meta/llama-3-8b-instruct', chat);
      console.log('AI response:', JSON.stringify(response));

      // Extrair o conteúdo da resposta
      const content = response.response;

      return new Response(JSON.stringify({ content }), {
        headers: {
          ...headers,
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error('Error in Cloudflare Worker:', error);
      return new Response(JSON.stringify({ error: 'Erro ao processar o plano alimentar: ' + error.message }), {
        status: 500,
        headers: {
          ...headers,
          'Content-Type': 'application/json',
        },
      });
    }
  }
};