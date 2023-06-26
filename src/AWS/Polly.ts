import {Polly, SynthesizeSpeechCommand, SynthesizeSpeechInput} from "@aws-sdk/client-polly";
import { writeFileSync } from "fs";
import streamToArray from 'stream-to-array';
import {Readable} from "stream";

const REGION = 'ap-northeast-2';
const ACCESS_KEY = process.env.AWS_ACCESS_KEY_ID ?? '';
const SECRET_KEY = process.env.AWS_SECRET_ACCESS_KEY ?? '';

class PollyService {
    private polly: Polly;

    constructor() {
        this.polly = new Polly({
            region: REGION,
            credentials: {
                accessKeyId: ACCESS_KEY,
                secretAccessKey: SECRET_KEY,
            }
        })
    }

    async synthesizeSpeech(params: SynthesizeSpeechInput): Promise<string | undefined> {
        try {
            const response = await this.polly.send(new SynthesizeSpeechCommand(params));

            if (response.AudioStream) {
                const array = await streamToArray(response.AudioStream as Readable);
                const audioBuffer = Buffer.concat(array.map(part => Buffer.from(part)));

                writeFileSync('speach.mp3', audioBuffer);
                return process.cwd() + '/speach.mp3';
            }

            return;
        } catch (err) {
            console.log('An error occurred', err);
            return;
        }
    }
}

export default PollyService;
