import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

let ffmpeg = null;

const loadFFmpeg = async () => {
    if (ffmpeg) return ffmpeg;
    ffmpeg = new FFmpeg();
    const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';
    await ffmpeg.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
    });
    return ffmpeg;
};

self.onmessage = async (e) => {
    const { action, payload } = e.data;

    try {
        if (action === 'LOAD') {
            await loadFFmpeg();
            self.postMessage({ type: 'LOAD_DONE' });
        } else if (action === 'TRIM') {
            const { file, start, end } = payload;
            const ffmpegInstance = await loadFFmpeg();
            const inputName = 'input.webm';
            const outputName = 'output.mp4';

            await ffmpegInstance.writeFile(inputName, await fetchFile(file));
            await ffmpegInstance.exec([
                '-ss', start.toString(),
                '-to', end.toString(),
                '-i', inputName,
                '-c', 'copy',
                outputName
            ]);
            const data = await ffmpegInstance.readFile(outputName);
            self.postMessage({ type: 'TRIM_DONE', payload: data.buffer }, [data.buffer]);
        }
    } catch (err) {
        self.postMessage({ type: 'ERROR', payload: err.message });
    }
};
