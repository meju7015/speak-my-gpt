import {Configuration, OpenAIApi} from 'openai'

class OpenAIClient {
    protected readonly config: Configuration;
    protected client: OpenAIApi;

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
}

export default OpenAIClient;
