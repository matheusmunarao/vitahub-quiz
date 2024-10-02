import axios from 'axios';

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

// Função para obter o token de forma segura
const getOpenAIToken = () => {
  // Em um ambiente de produção, isso deve vir de variáveis de ambiente ou um serviço de gerenciamento de segredos
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
    const response = await axios.post(OPENAI_API_URL, {
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 1000
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