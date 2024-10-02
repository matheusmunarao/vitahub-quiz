import axios from 'axios';
import appConfig from '../config/appConfig';

const getOpenAIToken = () => {
  return process.env.REACT_APP_OPENAI_API_KEY || '';
};

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

export const fetchAIPlan = async (prompt) => {
  const token = getOpenAIToken();
  if (!token) {
    throw new Error('Token da API OpenAI não encontrado');
  }

  try {
    const response = await axios.post(appConfig.OPENAI_API_URL, {
      model: appConfig.MODEL,
      messages: [{ role: "user", content: prompt }],
      temperature: appConfig.TEMPERATURE,
      max_tokens: appConfig.MAX_TOKENS
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.data && response.data.choices && response.data.choices.length > 0) {
      return response.data.choices[0].message.content.trim();
    } else {
      throw new Error('Resposta da API não contém dados válidos');
    }
  } catch (error) {
    console.error('Erro ao buscar plano da IA:', error.message);
    throw error;
  }
};
