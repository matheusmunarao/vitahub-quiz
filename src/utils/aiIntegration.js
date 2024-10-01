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
  // Aqui você implementaria a chamada para a API de IA
  // Por enquanto, vamos retornar um plano de exemplo
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`
        Plano Alimentar Personalizado

        Café da manhã:
        - Omelete de claras com espinafre e tomate
        - 1 fatia de pão integral
        - 1 porção de frutas vermelhas

        Lanche da manhã:
        - Iogurte grego com chia e amêndoas

        Almoço:
        - Peito de frango grelhado
        - Quinoa
        - Salada de folhas verdes variadas
        - Azeite extra virgem

        Lanche da tarde:
        - 1 maçã
        - 1 punhado de castanhas

        Jantar:
        - Salmão assado
        - Brócolis no vapor
        - Batata doce assada

        Recomendação de ingestão diária:
        - Calorias: 1800-2000 kcal
        - Proteínas: 100-120g
        - Carboidratos: 200-250g
        - Gorduras: 50-60g

        Substituições:
        - Se vegetariano/vegano, substitua as proteínas animais por tofu, tempeh ou leguminosas
        - Se intolerante à lactose, use alternativas vegetais para o iogurte

        Lembre-se de beber bastante água ao longo do dia e ajustar as porções conforme necessário.
      `);
    }, 2000);
  });
};