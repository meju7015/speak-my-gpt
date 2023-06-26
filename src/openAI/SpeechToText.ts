import OpenAIClient from "./OpenAIClient";
import {createReadStream} from "fs";

class SpeechToText extends OpenAIClient {
    /**
     * 음성 파일을 텍스트로 변환
     * 
     * @param audioFile
     */
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
