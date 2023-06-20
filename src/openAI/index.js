import { Configuration, OpenAIApi } from 'openai'

class ChatGPT {
  _config;
  _client;

  constructor () {
    this._config = new Configuration({
      apiKey: process.env.OPENAI_API_KEY
    });

    this._client = new OpenAIApi(this._config);
  }

  static getChannel() {
    return new ChatGPT();
  }

  getClient() {
    return this._client;
  }

  getConfig() {
    return this._config;
  }

  setClient(client) {
    this._client = client;
  }

  setConfig(config) {
    this._config = config;
  }

  async request(messages, options = { model: 'gpt-3.5-turbo' }) {
    try {
      const response = await this._client.createChatCompletion({
        ...options,
        messages,
      });

      return response.data;
    } catch (err) {
      console.error('exception request error ::', err);
      return null;
    }
  }
}


export const callOpenAI = async (prompt) => {
  if (!process.env.OPENAI_API_KEY) {
    console.error('API 키가 없습니다.');
    return null;
  }

  const config = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });

  try {
    const openai = new OpenAIApi(config);

    const response = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages:[{role: 'user', content: prompt}],
    });

    return response.data.choices[0].message;
  } catch (err) {
    console.error('Error :: ', err);
    return null;
  }
}
