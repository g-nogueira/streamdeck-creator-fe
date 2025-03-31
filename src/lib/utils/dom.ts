import domtoimage from 'dom-to-image-more';

export async function nodeToBase64Png(node: Node): Promise<string> {
    if (typeof window === 'undefined') {
        console.error('NodeToBase64Png called on server-side');
        return Promise.reject('Cannot process image on the server');
    }

    if (!node) {
        console.error('No icon found to download');
        return Promise.reject('No icon found to download');
    }

    return new Promise((resolve, reject) => {
        domtoimage.toPng(node, { copyDefaultStyles: false })
            .then((dataUrl: string) => {
                resolve(dataUrl);
            })
            .catch((err: string) => {
                console.error('Error downloading icon:', err);
                reject(err);
            });
    });
}

export async function downloadIcon(node: Node, fileName: string): Promise<void> {
    if (typeof window === 'undefined') {
        console.error('DownloadIcon called on server-side');
        return;
    }

    if (!node) {
        throw new Error('No HTML element #iconToCapture found to save');
    }

    if (!fileName) {
        throw new Error('No label found to save');
    }

    nodeToBase64Png(node)
        .then((dataUrl: string) => {
            const a = document.createElement('a');
            a.href = dataUrl;
            a.download = fileName + '.png';
            a.click();
        })
        .catch((err: string) => {
            console.error('Error downloading icon:', err);
        });
}