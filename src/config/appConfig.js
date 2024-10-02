import dotenv from 'dotenv';

dotenv.config();

const appConfig = {
  OPENAI_API_URL: 'https://api.openai.com/v1/chat/completions',
  MAX_TOKENS: 1000,
  TEMPERATURE: 0.7,
  MODEL: 'gpt-3.5-turbo',
  OPENAI_API_KEY: process.env.VITE_REACT_APP_OPENAI_API_KEY || '',
};

export default appConfig;