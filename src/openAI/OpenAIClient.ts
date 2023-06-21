import {Configuration, OpenAIApi} from 'openai'
import {ChatCompletionRequestMessage, CreateChatCompletionRequest} from "openai/api";

class OpenAIClient {
    private readonly config: Configuration;
    private client: OpenAIApi;

    constructor() {
        this.config = new Configuration({
            apiKey: process.env.OPENAI_API_KEY
        });

        this.client = new OpenAIApi(this.config);
    }

    static getChannel() {
        return new OpenAIClient();
    }

    getClient() {
        return this.client;
    }

    getConfig() {
        return this.config;
    }

    setClient(client: OpenAIApi) {
        this.client = client;
    }

    async request(messages: Array<ChatCompletionRequestMessage>, options = { model: 'gpt-3.5-turbo' }) {
        try {
            const response = await this.client.createChatCompletion({
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

export default OpenAIClient;


export const callOpenAI = async (prompt: string) => {
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
            messages: [{role: 'user', content: prompt}],
        });

        return response.data.choices[0].message;
    } catch (err) {
        console.error('Error :: ', err);
        return null;
    }
}
