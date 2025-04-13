import { eventBus } from "../modules/EventBus/EventBus.js";

class ChatWebSocket {
    constructor() {
        this.socket = null;
        this.connected = false;
        this.baseUrl = "ws://localhost:8080/ws";
    }

    connect() {
        this.socket = new WebSocket(this.baseUrl);

        this.socket.onopen = () => {
            this.connected = true;
            eventBus.emit("ws:connected");
            console.log("WS is connected");
        };

        this.socket.onmessage = (event) => {
            try {
                const message = JSON.parse(event.data);
                eventBus.emit(`ws:${message.type}`, message.data);
            } catch (error) {
                console.error("WebSocket message error:", error);
            }
        };

        this.socket.onclose = () => {
            this.connected = false;
            setTimeout(() => this.connect(), 3000);
        };

        this.socket.onerror = (error) => {
            console.error("WebSocket error:", error);
        };
    }

    send(message) {
        if (this.connected) {
            this.socket.send(JSON.stringify(message));
        } else {
            console.warn("WebSocket not connected");
        }
    }
}

// export const chatWebSocket = new ChatWebSocket();
