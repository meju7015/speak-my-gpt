

import PlaySound from "play-sound";
import SpeechToText from "../openAI/SpeechToText";
import ChatGPT from "../openAI/ChatGPT";
import PollyService from "../aws/Polly";

export async function speechAndChat() {
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

export async function chatSample(prompt: string) {
    const gpt = new ChatGPT();
    const player = PlaySound({});

    console.time('chat-api');
    const response = await gpt.chat(prompt);
    console.timeEnd('chat-api');

    if (response?.choices?.[0].message) {
        console.log(response?.choices?.[0].message);

        const pollyService = new PollyService();

        const mp3 = await pollyService.synthesizeSpeech({
            Text: response.choices[0].message.content,
            OutputFormat: 'mp3',
            VoiceId: 'Seoyeon',
        });


        if (mp3) {
            player.play(mp3, (err) => {
                if (err) {
                    console.error('Could not play sound: ', err);
                }
            })
        }

        return;
    }
}

export async function streamChatSample(prompt: string) {
    const gpt = new ChatGPT();
    const player = PlaySound({});
    const words: string[] = [];

    console.time('chat-api');
    await gpt.stream(prompt).then((response) => {
        console.timeEnd('chat-api');

        if (response) {
            response.on('data', (chunk) => {
                const payloads = chunk.toString().split('\n\n');
                for (const payload of payloads) {
                    if (payload.includes('[DONE]')) return;
                    if (payload.startsWith('data:')) {
                        const data = JSON.parse(payload.replace('data: ',  ''));
                        try {
                            const chunk: undefined | string = data.choices[0].delta?.content;
                            if (chunk) {
                                words.push(chunk);
                            }
                        } catch(err) {
                            console.error(err);
                        }
                    }
                }

            });

            response.on('end', () => {
                console.log(words);
            });
        }
    });
}
