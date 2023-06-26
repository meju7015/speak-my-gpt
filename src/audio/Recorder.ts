import fs from 'fs';
import {record, Recording} from 'node-record-lpcm16';

// TODO :: 테스트 필요
class Recorder {
    private readonly recordingFile: string;
    private recorder: Recording | null;

    constructor() {
        this.recordingFile = 'recording.wav';
        this.recorder = null;
    }

    start(duration: number) {
        return new Promise((resolve, reject) => {
            this.recorder = record({
                sampleRate: 16000,
                verbose: false,
            }).start();

            this.recorder
                .stream()
                .pipe(fs.createWriteStream(this.recordingFile))
                .on('close', () => {
                    resolve(this.recordingFile);
                });

            setTimeout(() => {
                this.stop()
                    .then(resolve)
                    .catch(reject);
            }, duration);
        });
    }

    stop() {
        return new Promise((resolve, reject) => {
            if (this.recorder) {
                this.recorder.stop();
                this.recorder = null;
                resolve(this.recordingFile);
            } else {
                reject(new Error('녹음 중이 아닙니다.'))
            }
        });
    }
}

export default Recorder;
