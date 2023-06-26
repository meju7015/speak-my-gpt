import OpenAIClient from "./OpenAIClient";
import {createReadStream} from "fs";

class SpeechToText extends OpenAIClient {
    async translate(audioFile: string) {
        const file = createReadStream(audioFile);

        if (!file) {
            console.error('audio file is not found');
        }

        const response = await this.client.createTranscription(
            file as any,
            'whisper-1',
            '',
            'json',
            0,
            'ko'
        );

        return response.data;
    }
}

export default SpeechToText;
