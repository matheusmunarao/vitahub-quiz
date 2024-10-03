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
        Nível de atividade: ${answers.activityLevel}
        Objetivo: ${answers.goal}

        O plano deve incluir:
        1. Sugestões de refeições (café da manhã, almoço, jantar e lanches)
        2. Recomendações diárias de ingestão de calorias e nutrientes (proteínas, carboidratos, gorduras)
        3. Sugestões de substituição de alimentos se houver restrições
        
        Por favor, forneça um plano detalhado e personalizado com base nessas informações.`
      }
    ]
  };
};

export const fetchAIPlan = async (answers) => {
  const cloudflareWorkerUrl = appConfig.CLOUDFLARE_URL;

  if (!cloudflareWorkerUrl) {
    throw new Error('URL do Cloudflare Worker não encontrada. Verifique suas variáveis de ambiente.');
  }

  const prompt = generateAIPrompt(answers);

  try {
    console.log('Fazendo requisição para:', cloudflareWorkerUrl);
    console.log('Enviando prompt:', JSON.stringify(prompt, null, 2));

    const response = await fetch(cloudflareWorkerUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': window.location.origin,
      },
      body: JSON.stringify(prompt),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Resposta de erro da API:', errorText);
      throw new Error(`Erro na API: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    console.log('Resposta da API:', JSON.stringify(result, null, 2));

    if (!result.tasks || result.tasks.length === 0 || !result.tasks[0].response) {
      throw new Error('Formato de resposta inválido da API');
    }

    return result.tasks[0].response;
  } catch (error) {
    console.error('Erro ao buscar plano alimentar:', error);
    throw new Error(`Erro ao buscar plano alimentar: ${error.message}`);
  }
};