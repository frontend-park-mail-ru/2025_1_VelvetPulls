import { eventBus } from "../modules/EventBus/EventBus.js";
import { Message } from "../../entities/Message/index.js";
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
            console.log("WS is connected");
            eventBus.emit("ws:connected");
        };

        this.socket.onmessage = (event) => {
            console.log("I GOT NEW MESSAGE");
            try {
                console.log("event data:", event.data);
                const message = JSON.parse(event.data);
                if (message.action === "newMessage") {
                    const msg = Message.fromApi(message.payload);
                    eventBus.emit("ws:NEW_MESSAGE", msg);
                }
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

export const chatWebSocket = new ChatWebSocket();
