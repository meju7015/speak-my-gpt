"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var openai_1 = require("openai");
var OpenAIClient = /** @class */ (function () {
    function OpenAIClient() {
        this.config = new openai_1.Configuration({
            apiKey: process.env.OPENAI_API_KEY
        });
        this.client = new openai_1.OpenAIApi(this.config);
    }
    OpenAIClient.getChannel = function () {
        return new OpenAIClient();
    };
    OpenAIClient.prototype.getClient = function () {
        return this.client;
    };
    OpenAIClient.prototype.getConfig = function () {
        return this.config;
    };
    OpenAIClient.prototype.setClient = function (client) {
        this.client = client;
    };
    return OpenAIClient;
}());
exports.default = OpenAIClient;
/*
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
*/
