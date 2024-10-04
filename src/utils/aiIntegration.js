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
          
          Informações detalhadas do usuário:
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
          3. Um plano alimentar semanal detalhado, com refeições para cada dia da semana.
          4. Recomendações diárias de ingestão de calorias e nutrientes (proteínas, carboidratos, gorduras).
          5. Sugestões de substituição de alimentos, se houver restrições.
          6. Dicas gerais de saúde e nutrição baseadas no objetivo e condição de saúde do usuário.
          
          Por favor, formate a resposta usando marcadores HTML simples para melhorar a legibilidade:
          - Use <h1> para o título principal
          - Use <h2> para os títulos dos dias da semana
          - Use <h3> para os títulos das refeições
          - Use <p> para parágrafos de texto
          - Use <ul> e <li> para listas não ordenadas
          - Use <strong> para enfatizar informações importantes
          
          Certifique-se de que a formatação seja consistente e que não haja espaços excessivos entre as seções.
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
      const aiResponse = result[0].response.response;
      return formatAIResponse(aiResponse);
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
  // Remove espaços em branco excessivos
  let formattedContent = content.replace(/\s+/g, ' ').trim();

  // Converte markdown para HTML
  formattedContent = formattedContent
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br>')
    .replace(/^\s*[-*]\s(.*)$/gm, '<li>$1</li>')
    .replace(/<li>(.*?)<\/li>/g, '<ul><li>$1</li></ul>')
    .replace(/^# (.*$)/gm, '<h1>$1</h1>')
    .replace(/^## (.*$)/gm, '<h2>$1</h2>')
    .replace(/^### (.*$)/gm, '<h3>$1</h3>');

  // Adiciona classes do Tailwind para melhorar a aparência
  formattedContent = formattedContent
    .replace(/<h1>/g, '<h1 class="text-3xl font-bold text-green-600 mb-4">')
    .replace(/<h2>/g, '<h2 class="text-2xl font-semibold text-green-500 mt-6 mb-3">')
    .replace(/<h3>/g, '<h3 class="text-xl font-medium text-green-400 mt-4 mb-2">')
    .replace(/<p>/g, '<p class="mb-2">')
    .replace(/<ul>/g, '<ul class="list-disc list-inside mb-4">')
    .replace(/<strong>/g, '<strong class="font-semibold">');

  return formattedContent;
};