import * as dotenv from 'dotenv';

dotenv.config();
/*
import {bootstrap} from './http/app';
bootstrap();*/

import {App, subtype} from '@slack/bolt';
import ChatGPT from "./openAI/ChatGPT";
import {ChatCompletionRequestMessage} from "openai/api";
import {inspect} from 'util';

interface IThreadHistory {
    thread_ts: string;
    messages: ChatCompletionRequestMessage[];
}

const threadHistory: IThreadHistory[] = [];

function getWeather(params: { location: string }) {
    return `The weather in ${params.location} is 72 degrees and sunny.`;
}

function tvOn(params: { channel: string }) {
    return `tv on ${params.channel}`;
}

function switchControl(switches: Array<{ name: string, on: boolean }>) {
    return `switch control ${inspect(switches)}`;
}

const app = new App({
    socketMode: true,
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    appToken: process.env.SLACK_APP_TOKEN,
});

const gpt = new ChatGPT();

app.message('!func', async ({event, client}) => {
    if ('text' in event) {
        const messages: ChatCompletionRequestMessage[] = [];
        const functions = [
            {
                name: 'switchControl',
                description: '각각의 스위치를 켜고 끌수 있습니다.',
                parameters: {
                    type: 'object',
                    properties: {
                        switches: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    name: {
                                        type: 'string',
                                        description: '스위치 이름'
                                    },
                                    on: {
                                        type: 'boolean',
                                        description: '스위치 상태'
                                    }
                                }
                            }
                        }
                    }
                }
            },
            {
                name: 'getWeather',
                description: 'get the current weather in a given location',
                parameters: {
                    type: 'object',
                    properties: {
                        location: {
                            type: 'string',
                            description: 'the city and state. e. g. Seoul, Korea'
                        }
                    }
                }
            },
            {
                name: 'tvOn',
                description: 'tv를 켠다',
                parameters: {
                    type: 'object',
                    properties: {
                        channel: {
                            type: 'string',
                            description: 'start tv channel'
                        }
                    }
                }
            }
        ];

        messages.push({
            role: 'user',
            content: event.text,
        });

        const result = await gpt.functionChat(messages, functions);

        if (result?.data.choices?.[0].message) {
            console.log('result :: ', result.data.choices[0].message);

            result.data.choices.map((choice) => {
                const _func = choice.message?.function_call?.name;
                const _params = choice.message?.function_call?.arguments ?? {};

                console.log('function :: ', _func, _params);

                if (_func) {
                    const result = eval(`${_func}(${_params})`);
                    console.log(result);
                }
            });
        }
    }
    }
)
    ;

    app.event('reaction_added', async ({event, client}) => {
        console.log('이벤트 :: ', event);
    });

    app.event('message', async ({event, client}) => {
        console.info(inspect(event, false, null, true));

        if ("thread_ts" in event) {
            const thread = threadHistory.find(thread => thread.thread_ts === event.thread_ts);

            if (thread && event.text) {
                const request: ChatCompletionRequestMessage[] = [
                    ...thread.messages,
                    {role: 'user', content: event.text}
                ];

                try {
                    const result = await gpt.chatRaw(request);
                    if (result?.choices?.[0].message) {
                        await client.chat.postMessage({
                            channel: event.channel,
                            thread_ts: event.thread_ts,
                            text: result.choices[0].message.content,
                        });
                    }
                } catch (err) {
                    await client.chat.postMessage({
                        channel: event.channel,
                        thread_ts: event.thread_ts,
                        text: '오류가 발생했습니다 다시 시도해보세요.',
                    });
                }
            }
        }
    });

    app.message('!!info', async ({message, client}) => {
        const now = new Date();
        const unixTime = Math.floor(now.getTime() / 1000);

        await client.chat.postMessage({
            channel: message.channel,
            thread_ts: message.ts,
            text: 'test',
        });
    });

    app.message('!!keyword', async ({message, client}) => {
        if ('text' in message) {
            const text: string = message?.text?.replace('!!keyword', '') ?? '';

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

    app.message('!!gpt4', async ({message, ack, client}) => {
        if ("text" in message) {
            const text: string = message.text?.replace('!!gpt', '') ?? '';
            const gpt = new ChatGPT();

            const result = await gpt.chat(text, {model: 'gpt-4'});

            if (result?.choices?.[0].message) {
                await client.chat.postMessage({
                    channel: message.channel,
                    thread_ts: message.ts,
                    text: result.choices[0].message.content,
                });

                const thread = threadHistory.find((thread) => thread.thread_ts === message.ts)

                if (thread) {
                    thread.messages.push({role: 'user', content: text});
                    thread.messages.push(result.choices[0].message);
                } else {
                    threadHistory.push({
                        thread_ts: message.ts,
                        messages: [
                            {role: 'user', content: text},
                            result.choices[0].message,
                        ],
                    })
                }
            }
        }
    });

    app.message('!!gpt', async ({message, client}) => {
        if ("text" in message) {
            const text: string = message.text?.replace('!!gpt', '') ?? '';
            const gpt = new ChatGPT();

            const result = await gpt.chat(text);

            if (result?.choices?.[0].message) {
                await client.chat.postMessage({
                    channel: message.channel,
                    thread_ts: message.ts,
                    text: result.choices[0].message.content,
                });

                const thread = threadHistory.find((thread) => thread.thread_ts === message.ts)

                if (thread) {
                    thread.messages.push({role: 'user', content: text});
                    thread.messages.push(result.choices[0].message);
                } else {
                    threadHistory.push({
                        thread_ts: message.ts,
                        messages: [
                            {role: 'user', content: text},
                            result.choices[0].message,
                        ],
                    })
                }

                console.log("히스토리 :: ", threadHistory);
            }
        }
    });

    (async () => {
        await app.start(process.env.PORT || 3000);
        console.log('bolt app is running!');
    })();



