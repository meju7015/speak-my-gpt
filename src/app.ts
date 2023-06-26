import * as dotenv from 'dotenv';
dotenv.config();
/*
import {bootstrap} from './http/app';
bootstrap();*/

import { App } from '@slack/bolt';
import ChatGPT from "./openAI/ChatGPT";

const app = new App({
    socketMode: true,
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    appToken: process.env.SLACK_APP_TOKEN,
});

app.message('!!info', async ({ message, client }) => {
    console.log(message);
    const now = new Date();
    const unixTime = Math.floor(now.getTime() / 1000);

    await client.chat.postMessage({
        channel: message.channel,
        thread_ts: message.ts,
        text: 'test',
    });
});

app.message('!!keyword', async ({ message, client }) => {
    if ('text' in message) {
        const text: string = message?.text?.replace('!!keyword', '') ?? '';
        const gpt = new ChatGPT();

        const result = await gpt.chat(`${text} 이 문장에 대한 대표 키워드 3개이상 5개미만 마크다운 코드 형식으로 추출해줘`);

        if (result?.choices?.[0].message) {
            await client.chat.postMessage({
                channel: message.channel,
                thread_ts: message.ts,
                text: `질문의 대표 키워드 :: ${result.choices[0].message.content}`,
            });
        }
    }
});

app.message('헤이쥐피티', async ({ message, client }) => {
    if ("text" in message) {
        const text: string = message.text?.replace('헤이쥐피티', '') ?? '';
        const gpt = new ChatGPT();

        const result = await gpt.chat(text);

        if (result?.choices?.[0].message) {
            await client.chat.postMessage({
                channel: message.channel,
                thread_ts: message.ts,
                text: result.choices[0].message.content,
            });
        }
    }
});

(async () => {
    await app.start(process.env.PORT || 3000);
    console.log('bolt app is running!');
})();



