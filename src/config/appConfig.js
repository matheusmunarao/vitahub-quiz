const appConfig = {
  OPENAI_API_URL: 'https://api.openai.com/v1/completions',
  MAX_TOKENS: 500,
  TEMPERATURE: 0.7,
  MODEL: 'gpt-3.5-turbo',
  OPENAI_API_KEY: import.meta.env.VITE_REACT_APP_OPENAI_API_KEY || '',
};

export default appConfig;