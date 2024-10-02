import axios from 'axios';
import { fetchAIPlan, generateAIPrompt } from '../utils/aiIntegration';

jest.mock('axios');

describe('aiIntegration', () => {
  describe('generateAIPrompt', () => {
    it('generates a prompt based on user answers', () => {
      const mockAnswers = {
        name: 'John Doe',
        age: '30',
        activityLevel: 'Moderado',
        dietRestrictions: 'Nenhuma',
        carbConsumption: 'Às vezes',
        proteinConsumption: 'Frequentemente',
        vegetableConsumption: 'Frequentemente',
        fruitConsumption: 'Às vezes',
        goal: 'Perda de peso',
        healthCondition: 'Nenhuma',
      };

      const prompt = generateAIPrompt(mockAnswers);

      expect(prompt).toContain('John Doe');
      expect(prompt).toContain('30');
      expect(prompt).toContain('Moderado');
      expect(prompt).toContain('Nenhuma');
      expect(prompt).toContain('Às vezes');
      expect(prompt).toContain('Frequentemente');
      expect(prompt).toContain('Perda de peso');
    });
  });

  describe('fetchAIPlan', () => {
    beforeEach(() => {
      process.env.REACT_APP_OPENAI_API_KEY = 'test-api-key';
    });

    afterEach(() => {
      delete process.env.REACT_APP_OPENAI_API_KEY;
    });

    it('fetches AI plan successfully', async () => {
      const mockResponse = {
        data: {
          choices: [
            {
              message: {
                content: 'This is a test plan',
              },
            },
          ],
        },
      };

      axios.post.mockResolvedValue(mockResponse);

      const result = await fetchAIPlan('Test prompt');

      expect(result).toBe('This is a test plan');
      expect(axios.post).toHaveBeenCalledWith(
        'https://api.openai.com/v1/chat/completions',
        expect.any(Object),
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': 'Bearer test-api-key',
          }),
        })
      );
    });

    it('throws an error when API call fails', async () => {
      axios.post.mockRejectedValue(new Error('API Error'));

      await expect(fetchAIPlan('Test prompt')).rejects.toThrow('API Error');
    });

    it('throws an error when API response is invalid', async () => {
      const mockResponse = {
        data: {
          choices: [],
        },
      };

      axios.post.mockResolvedValue(mockResponse);

      await expect(fetchAIPlan('Test prompt')).rejects.toThrow('Resposta da API não contém dados válidos');
    });
  });
});