import { API_HOST, API_PORT } from "./api.js";

import { eventBus } from "../modules/EventBus/EventBus.js";
import { Message } from "../../entities/Message/index.js";

class ChatWebSocket {
    constructor() {
        this.socket = null;
        this.connected = false;
        this.baseUrl = `ws://${API_HOST}:8082/ws`;
    }

    connect() {
        this.socket = new WebSocket(this.baseUrl);

        this.socket.onopen = () => {
            this.connected = true;
            eventBus.emit("ws:connected");
        };

        this.socket.onmessage = (event) => {
            try {
                const message = JSON.parse(event.data);
                switch (message.action) {
                    case "newMessage":
                        const msg = Message.fromApi(message.payload);
                        eventBus.emit("ws:NEW_MESSAGE", msg);
                        break;
                    case "updateMessage":
                        const updatedMsg = Message.fromApi(message.payload);
                        eventBus.emit("ws:MESSAGE_UPDATED", updatedMsg);
                        break;
                    case "deleteMessage":
                        eventBus.emit("ws:MESSAGE_DELETED", message.payload.id);
                        break;
                    default:
                        console.warn("Unknown WebSocket action:", message.action);
                }
            } catch (error) {
                //console.error("WebSocket message error:", error);
            }
        };

        this.socket.onclose = () => {
            this.connected = false;
            // setTimeout(() => this.connect(), 3000);
        };

        this.socket.onerror = (error) => {
            //console.error("WebSocket error:", error);
        };
    }

    disconnect() {
        if (this.socket !== null) {
            this.socket.close();
        }
    }

    reconnect() {
        this.disconnect();
        this.connect();
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
