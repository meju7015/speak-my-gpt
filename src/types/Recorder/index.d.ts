declare module 'node-record-lpcm16' {
    namespace record {
        interface RecordingOptions {
            sampleRate?: number;
            channels?: number;
            compress?: boolean;
            threshold?: number;
            thresholdStart?: any;
            thresholdEnd?: any;
            silence?: string;
            recorder?: string;
            endOnSilence?: boolean;
            audioType?: string;
        }

        class Recording {
            constructor(options?: RecordingOptions);

            options: RecordingOptions;
            cmd: string;
            args: string[];
            cmdOptions: any;
            process: any;
            _stream: any;

            start(): this;
            stop(): void;
            pause(): void;
            resume(): void;
            isPaused(): boolean;
            stream(): any;
        }

        function record(...args: any[]): Recording;
    }

    export = record;
}
