import appConfig from '../config/appConfig';

export const generateAIPrompt = (answers) => {
  return {
    messages: [
      {
        role: 'system',
        content: 'You are a helpful nutritional assistant.'
      },
      {
        role: 'user',
        content: `Generate a meal plan for a person with the following characteristics:

        Age: ${answers.age}
        Dietary restrictions: ${answers.dietRestrictions}
        Activity level: ${answers.activityLevel}
        Goal: ${answers.goal}

        The plan should include:
        1. Meal suggestions (breakfast, lunch, dinner, and snacks)
        2. Daily calorie and nutrient intake recommendations (proteins, carbohydrates, fats)
        3. Food substitution suggestions if there are restrictions
        
        Please provide a detailed and personalized plan based on this information.`
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
    console.log('Sending prompt:', JSON.stringify(prompt, null, 2));

    const response = await fetch(cloudflareWorkerUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(prompt),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    console.log('API Response:', JSON.stringify(result, null, 2));

    if (!result.tasks || result.tasks.length === 0 || !result.tasks[0].response) {
      throw new Error('Invalid response format from API');
    }

    return result.tasks[0].response;
  } catch (error) {
    console.error('Error fetching meal plan:', error);
    throw new Error(`Error fetching meal plan: ${error.message}`);
  }
};