import OpenAIClient from "./OpenAIClient";
import {ChatCompletionRequestMessage, CreateChatCompletionResponse} from "openai/api";
import {IncomingMessage} from "http";
import {ChatCompletionFunctions} from "openai";
import {inspect} from "util";

class ChatGPT extends OpenAIClient {
    private messages: Array<ChatCompletionRequestMessage> = [];

    /**
     * 스트림 방식으로 응답
     *
     * @param message
     * @param options
     */
    async stream(message: string, options = { model: 'gpt-3.5-turbo' }): Promise<IncomingMessage|null> {
        try {
            const newMessage: ChatCompletionRequestMessage = { role: 'user', content: message };
            const messages: Array<ChatCompletionRequestMessage> = [
                ...this.messages,
                newMessage,
            ];

            const response = await this.client.createChatCompletion({
                ...options,
                messages,
                stream: true,
            }, {
                responseType: 'stream'
            });

            return response.data as unknown as IncomingMessage;
        } catch (err) {
            console.error('exception request error ::', err);
            return null;
        }
    }

    async functionChat(messages: ChatCompletionRequestMessage[], functions: ChatCompletionFunctions[]) {
        try {
            const response = await this.client.createChatCompletion({
                model: 'gpt-3.5-turbo-0613',
                messages: messages,
                functions: functions,
                function_call: 'auto',
            });

            return response;
        } catch(err) {
            console.error(err);
        }
    }

    async chatRaw(messages: ChatCompletionRequestMessage[], options = { model: 'gpt-3.5-turbo' }): Promise<CreateChatCompletionResponse | null> {
        try {
            const response = await this.client.createChatCompletion({
                ...options,
                messages
            });

            return response.data;
        } catch (err) {
            //console.error('exception request error ::', err);
            return null;
        }
    }

    /**
     * API 응답 방식
     *
     * @param message
     * @param options
     */
    async chat(message: string, options = { model: 'gpt-3.5-turbo' }): Promise<CreateChatCompletionResponse | null> {
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
            //console.error('exception request error ::', err);
            return null;
        }
    }
}

export default ChatGPT;
