import appConfig from '../config/appConfig';

export const generateAIPrompt = (answers) => {
  return {
    messages: [
      {
        role: 'system',
        content: 'Você é um assistente nutricional útil.'
      },
      {
        role: 'user',
        content: `Gere um plano alimentar para uma pessoa com as seguintes características:

        Idade: ${answers.age}
        Restrições alimentares: ${answers.dietRestrictions}

        O plano deve incluir:
        1. Sugestões de refeições (café da manhã, almoço, jantar e lanches)
        2. Recomendação de ingestão diária de calorias e nutrientes (proteínas, carboidratos, gorduras)
        3. Sugestões de substituições alimentares, caso haja restrições
        
        Por favor, forneça um plano detalhado e personalizado com base nessas informações.`
      }
    ]
  };
};

export const fetchAIPlan = async (answers) => {
  const cloudflareWorkerUrl = appConfig.CLOUDFLARE_URL;

  if (!cloudflareWorkerUrl) {
    throw new Error('Cloudflare Worker URL not found. Please check your environment variables.');
  }

  const prompt = generateAIPrompt(answers);

  try {
    console.log('Fetching from Cloudflare Worker URL:', cloudflareWorkerUrl);
    const response = await fetch(cloudflareWorkerUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(prompt),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('API Error:', errorData);
      throw new Error(`API Error: ${errorData.error || response.statusText}`);
    }

    const result = await response.json();
    console.log('API Response:', result);
    return result.choices[0].message.content;
  } catch (error) {
    console.error('Erro ao buscar o plano alimentar da IA:', error);
    throw new Error(`Erro ao buscar o plano alimentar: ${error.message}`);
  }
};
