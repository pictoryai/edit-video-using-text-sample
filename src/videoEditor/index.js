import { v4 as uuid } from 'uuid';

export class VideoEditor {

    constructor(containerElement, editUrl) {
        const iframe = document.createElement('iframe');
        iframe.setAttribute('width', '100%');
        iframe.setAttribute('height', '100%');
        iframe.setAttribute('src', editUrl);
        iframe.style.border = 'none';
        iframe.style.display = 'none';
        this.inProgressTasks = {};

        containerElement.innerHTML = '';
        containerElement.append(iframe);

        window.addEventListener('message', this.receiveEditorMessages);

        this.iframe = iframe;

        this.onReady = null;
        this.onLoad = null;
        this.onLoadComplete = null;
    }

    close() {
        window.removeEventListener('message', this.receiveEditorMessages);
        if (this.iframe.parentNode) {
            this.iframe.parentNode.removeChild(this.iframe);
            this.iframe.setAttribute('src', '');
        }

        this.inProgressTasks = {};
    }

    setAccessToken = async (accessToken) => {
        await this.executeEditorAction({ message: 'SET_ACCESS_TOKEN', accessToken }).catch((error) => {
            throw new Error(`Failed to set access token: ${error.message}`);
        });
    }

    setVideoRenderCallbackHook = async (webhook) => {
        await this.executeEditorAction({ message: 'SET_VIDEO_RENDER_WEB_HOOK', webhook }).catch((error) => {
            throw new Error(`Failed to set video render webhook: ${error.message}`);
        });
    }

    executeEditorAction = async (message, payload) => {
        if (!this.ready) {
            throw new Error('The Editor is not loaded.');
        }

        const id = uuid();
        if (this.iframe.contentWindow) {
            this.iframe.contentWindow.postMessage({ id, ...JSON.parse(JSON.stringify(message)), ...payload }, '*');
        }

        // Create pending promise
        return new Promise((resolve, reject) => (this.inProgressTasks[id] = { resolve, reject }));
    }

    receiveEditorMessages = (event) => {
        if (!event.data || typeof event.data !== 'object') {
            return;
        }

        if (this.iframe.contentWindow !== event.source) {
            return;
        }

        const { id, message, error, ...args } = event.data;

        if (id) {
            // Resolve pending promise
            const inProgressTask = this.inProgressTasks[id];
            if (inProgressTask) {
                if (error) {
                    inProgressTask.reject(new Error(error));
                } else {
                    inProgressTask.resolve(args);
                }

                // Clean up
                delete this.inProgressTasks[id];
            }
        } else {
            switch (message) {
                case 'onReady':
                    this.ready = true;
                    if (this.onReady) {
                        this.onReady();
                    }
                    break;

                case 'onLoad':
                    if (this.onLoad) {
                        this.onLoad();
                    }
                    break;

                case 'onLoadComplete':
                    if (this.onLoadComplete) {
                        this.onLoadComplete();
                    }
                    break;
            }
        }
    };
}