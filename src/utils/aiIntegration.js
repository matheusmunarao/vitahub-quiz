import appConfig from '../config/appConfig';

export const generateAIPrompt = (answers) => {
  return {
    messages: [
      {
        role: 'system',
        content: 'Você é um assistente nutricional útil e especialista em saúde e bem-estar.',
      },
      {
        role: 'user',
        content: `Gere um plano alimentar personalizado para uma pessoa com as seguintes características:
        
        Nome: ${answers.name}
        Idade: ${answers.age}
        Nível de atividade física: ${answers.activityLevel}
        Restrições alimentares: ${answers.dietRestrictions}
        Consumo de carboidratos: ${answers.carbConsumption}
        Consumo de proteínas: ${answers.proteinConsumption}
        Consumo de vegetais: ${answers.vegetableConsumption}
        Consumo de frutas: ${answers.fruitConsumption}
        Objetivo principal: ${answers.goal}
        Condição de saúde pré-existente: ${answers.healthCondition}
        
        O plano deve incluir:
        1. Sugestões de refeições (café da manhã, almoço, jantar e lanches)
        2. Recomendação de ingestão diária de calorias e nutrientes (proteínas, carboidratos, gorduras)
        3. Sugestões de substituições alimentares, caso haja restrições
        
        Por favor, forneça um plano detalhado e personalizado com base nessas informações.`,
      }
    ]
  };
};

export const fetchAIPlan = async (answers) => {
  const cloudflareWorkerUrl = appConfig.CLOUDFLARE_URL;

  if (!cloudflareWorkerUrl) {
    console.error('Cloudflare Worker URL not found. Please check your environment variables.');
    throw new Error('Cloudflare Worker URL not configured. Please check your environment variables.');
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
      const errorText = await response.text();
      console.error('API Error:', response.status, errorText);
      throw new Error(`API Error: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    console.log('API Response:', result);

    if (!result[0] || !result[0].response || !result[0].response.response) {
      console.error('Unexpected API response structure:', result);
      throw new Error('Unexpected API response structure');
    }

    return result[0].response.response;
  } catch (error) {
    console.error('Error fetching meal plan:', error);
    if (error.message === 'Failed to fetch') {
      throw new Error('Failed to connect to the API. Please check your internet connection and try again.');
    }
    throw new Error(`Error fetching meal plan: ${error.message}`);
  }
};