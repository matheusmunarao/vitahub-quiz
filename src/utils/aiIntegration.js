import appConfig from '../config/appConfig';

export const generateAIPrompt = (answers) => {

  return {
    messages: [
      {
        role: 'system',
        content: 'Você é um assistente nutricional útil e amigável.'
      },
      {
        role: 'user',
        content: `
          Olá! Por favor, crie um plano alimentar personalizado para ${answers.name}, que tem ${answers.age} anos.
          
          Informações do usuário:
          - Nome: ${answers.name}
          - Idade: ${answers.age}
          - Nível de atividade física: ${answers.activityLevel}
          - Restrições alimentares: ${answers.dietRestrictions}
          - Consumo de carboidratos: ${answers.carbConsumption}
          - Consumo de proteínas: ${answers.proteinConsumption}
          - Consumo de vegetais: ${answers.vegetableConsumption}
          - Consumo de frutas: ${answers.fruitConsumption}
          - Objetivo principal: ${answers.goal}
          - Condição de saúde: ${answers.healthCondition}
          
          Por favor, forneça um plano alimentar detalhado e personalizado com base nessas informações. Inclua:
          1. Uma saudação personalizada usando o nome do usuário.
          2. Uma breve análise das informações fornecidas.
          3. Sugestões de refeições para café da manhã, almoço, jantar e lanches.
          4. Recomendações diárias de ingestão de calorias e nutrientes (proteínas, carboidratos, gorduras).
          5. Sugestões de substituição de alimentos, se houver restrições.
          6. Dicas gerais de saúde e nutrição baseadas no objetivo e condição de saúde do usuário.
        `
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

    if (Array.isArray(result) && result.length > 0) {
      const aiResponse = result[0].response.response; // Acesso à resposta da IA
      return aiResponse; // Retorne a resposta
    } else if (result && result.error) {
      throw new Error(`Erro do Worker: ${result.error}`);
    } else {
      console.error('Formato de resposta inválido:', result);
      throw new Error('Formato de resposta inválido da API');
    }
  } catch (error) {
    console.error('Erro ao buscar plano alimentar:', error);
    throw new Error(`Erro ao buscar plano alimentar: ${error.message}`);
  }
};

const formatAIResponse = (content) => {
  // Converte markdown para HTML
  let formattedContent = content
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br>')
    .replace(/^\s*[-*]\s(.*)$/gm, '<li>$1</li>')
    .replace(/<li>(.*?)<\/li>/g, '<ul><li>$1</li></ul>');

  return formattedContent;
};
