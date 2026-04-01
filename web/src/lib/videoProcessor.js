let worker = null;

const getWorker = () => {
    if (typeof window === 'undefined') return null;
    if (!worker) {
        worker = new Worker(new URL('./videoProcessorWorker.js', import.meta.url));
    }
    return worker;
};

export const loadFFmpeg = () => {
    return new Promise((resolve, reject) => {
        const w = getWorker();
        const handler = (e) => {
            if (e.data.type === 'LOAD_DONE') {
                w.removeEventListener('message', handler);
                resolve();
            } else if (e.data.type === 'ERROR') {
                w.removeEventListener('message', handler);
                reject(new Error(e.data.payload));
            }
        };
        w.addEventListener('message', handler);
        w.postMessage({ action: 'LOAD' });
    });
};

export const trimVideo = async (file, start, end) => {
    const w = getWorker();
    return new Promise((resolve, reject) => {
        const handler = (e) => {
            if (e.data.type === 'TRIM_DONE') {
                w.removeEventListener('message', handler);
                resolve(new Blob([e.data.payload], { type: 'video/mp4' }));
            } else if (e.data.type === 'ERROR') {
                w.removeEventListener('message', handler);
                reject(new Error(e.data.payload));
            }
        };
        w.addEventListener('message', handler);
        w.postMessage({ action: 'TRIM', payload: { file, start, end } });
    });
};

export const applyBlur = async (file, regions) => {
    return file; // No-op placeholder for now
};

export const combineVideos = async (files) => {
    return files[0]; // Placeholder
};
