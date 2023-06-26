import * as dotenv from 'dotenv';
import SpeechToText from "./openAI/SpeechToText";
import ChatGPT from "./openAI/ChatGPT";

dotenv.config();

async function speachAndChat() {
    const stt = new SpeechToText();
    const gpt = new ChatGPT();

    const response = await stt.translate('recording.mp3');

    if (response.text) {
        const chatRes = await gpt.chat(response.text);
        if (chatRes?.choices?.[0].message) {
            console.log(chatRes?.choices?.[0].message);
        }
    }
}

async function chatSample(prompt: string) {
    const gpt = new ChatGPT();

    console.time('chat-api');
    const response = await gpt.chat(prompt);
    console.timeEnd('chat-api');

    if (response?.choices?.[0].message) {
        console.log(response?.choices?.[0].message);
    }
}

chatSample(process.argv[2]);
