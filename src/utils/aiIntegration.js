import axios from 'axios';
import appConfig from '../config/appConfig';

// Função para gerar o prompt com base nas respostas do usuário
export const generateAIPrompt = (answers) => {
  return `Gere um plano alimentar personalizado para uma pessoa com as seguintes características:
  
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
  
  Por favor, forneça um plano detalhado e personalizado com base nessas informações.`;
};

// Função para fazer a chamada à API da OpenAI e obter o plano alimentar
export const fetchAIPlan = async (prompt) => {
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 1000,
        temperature: 0.7,
      },
      {
        headers: {
          'Authorization': `Bearer ${appConfig.OPENAI_API_KEY}`,
          'OpenAI-Organization': appConfig.OPENAI_ORGANIZATION_ID,
          'OpenAI-Project': appConfig.OPENAI_PROJECT_ID,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.data || !response.data.choices || response.data.choices.length === 0) {
      throw new Error('API response is empty or invalid.');
    }

    return response.data.choices[0].message.content.trim();
  } catch (error) {
    console.error('Erro ao buscar o plano alimentar da IA:', error.message);
    throw new Error(`Erro ao buscar o plano alimentar: ${error.message}`);
  }
};