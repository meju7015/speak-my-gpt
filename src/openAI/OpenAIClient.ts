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

    /**
     * OpenAIClient 는 각각의 채팅 세션을 갖으므로 다른 세션을 열려면
     * 새로운 인스턴스를 생성해야 합니다.
     */
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
