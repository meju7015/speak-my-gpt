import OpenAIClient from "./OpenAIClient";
import {ChatCompletionRequestMessage} from "openai/api";

class ChatGPT extends OpenAIClient {
    private messages: Array<ChatCompletionRequestMessage> = [];

    async chat(message: string, options = { model: 'gpt-3.5-turbo' }) {
        try {
            const newMessage: ChatCompletionRequestMessage = { role: 'user', content: message };
            const messages: Array<ChatCompletionRequestMessage> = [
                ...this.messages,
                newMessage,
            ];

            const response = await this.client.createChatCompletion({
                ...options,
                messages,
            });

            if (response.data.choices?.[0].message) {
                this.messages = [
                    ...messages,
                    response.data.choices?.[0].message,
                ]
            }

            return response.data;
        } catch (err) {
            console.error('exception request error ::', err);
            return null;
        }
    }
}

export default ChatGPT;
