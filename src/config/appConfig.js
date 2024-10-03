const appConfig = {
  OPENAI_API_KEY: import.meta.env.VITE_REACT_APP_OPENAI_API_KEY || '',
  OPENAI_ORGANIZATION_ID: import.meta.env.VITE_OPENAI_ORGANIZATION_ID || '',
  OPENAI_PROJECT_ID: import.meta.env.VITE_OPENAI_PROJECT_ID || '',
  CLOUDFLARE_URL: import.meta.env.VITE_CLOUDFLARE_URL || '',
};

export default appConfig;