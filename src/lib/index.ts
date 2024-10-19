// place files you want to import through the `$lib` alias in this folder.
import domtoimage from 'dom-to-image-more';

export class UUID {
    static readonly empty: string = '00000000-0000-0000-0000-000000000000';

    static isEmpty(uuid: string): boolean {
        return uuid === this.empty;
    }
}

export class ImageProcessing {
    static async NodeToBase64Png(node: Element): Promise<string> {
        if (typeof window === 'undefined') {
            console.error('NodeToBase64Png called on server-side');
            return Promise.reject('Cannot process image on the server');
        }

        const domtoimage = await import('dom-to-image-more');
        
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

    static async DownloadIcon(node: Element, fileName: string): Promise<void> {
        if (typeof window === 'undefined') {
            console.error('DownloadIcon called on server-side');
            return;
        }

        this.NodeToBase64Png(node)
            .then((dataUrl: string) => {
                const a = document.createElement('a');
                a.href = dataUrl;
                a.download = fileName+'.png';
                a.click();
            })
            .catch((err: string) => {
                console.error('Error downloading icon:', err);
            });
    }
}
