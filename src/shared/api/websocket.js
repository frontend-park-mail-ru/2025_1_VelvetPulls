import { eventBus } from "../modules/EventBus/EventBus.js";

export class ChatWebSocket {
    constructor(url) {
        this.url = url;
        this.socket = null;
        this.connect();
    }

    connect() {
        this.socket = new WebSocket(this.url);

        this.socket.onmessage = (event) => {
            try {
                const message = JSON.parse(event.data);
                eventBus.emit(message.type, message.data);
            } catch (error) {
                console.error('Error parsing WebSocket message:', error);
            }
        };

        this.socket.onclose = () => {
            console.log('WebSocket disconnected, reconnecting...');
            setTimeout(() => this.connect(), 3000);
        };

        this.socket.onerror = (error) => {
            console.error('WebSocket error:', error);
        };
    }

    on(event, callback) {
        eventBus.on(event, callback);
    }

    send(message) {
        if (this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify(message));
        }
    }
}