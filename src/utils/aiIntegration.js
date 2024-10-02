import OpenAI from "openai";
import appConfig from '../config/appConfig';

// Inicializando o cliente OpenAI com a chave da API e as variáveis de organização e projeto
const openai = new OpenAI({
  apiKey: appConfig.OPENAI_API_KEY,  // Chave da API do arquivo de configuração
  organization: appConfig.OPENAI_ORGANIZATION_ID,  // ID da organização
  project: appConfig.OPENAI_PROJECT_ID,  // ID do projeto
});

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
    // Faz a requisição para a API de completions da OpenAI
    const response = await openai.completions.create({
      model: "gpt-3.5-turbo",  // Modelo a ser utilizado
      prompt: prompt,          // O prompt gerado pelas respostas do usuário
      max_tokens: 500,         // Limite de tokens de resposta
      temperature: 0.7,        // Controle da criatividade da IA
    });

    // Verifica se a resposta foi bem-sucedida
    if (!response || !response.choices || response.choices.length === 0) {
      throw new Error('API response is empty or invalid.');
    }

    // Retorna o texto gerado pela IA, removendo espaços desnecessários
    return response.choices[0].text.trim();
  } catch (error) {
    // Tratamento de erro: lança uma exceção caso haja falha na requisição
    console.error('Erro ao buscar o plano alimentar da IA:', error.message);
    throw new Error(`Erro ao buscar o plano alimentar: ${error.message}`);
  }
};
