import { websocketHost } from "@/app/config";
import { TMessageWS, NewChatWS } from "./types";

type THandler<T> = (payload: T) => void | Promise<void>;

class wsConnection {
  handlers: {
    [key: string]: THandler<any>[];
  };
  status;
  ws: WebSocket | null;
  url;
  constructor(url: string) {
    this.handlers = {};
    this.status = false;
    this.ws = null;
    this.url = url;
  }

  start() {
    if (this.status) {
      return;
    }

    this.ws = new WebSocket(this.url + "/ws");

    this.ws.onmessage = (event: MessageEvent) => {
      try {
        const res = JSON.parse(event.data);
        if (res.messageType === "error") return;

        let payload: any;
        
        // Обработка разных типов событий
        switch (res.action) {
          case 'newMessage':
          case 'updateMessage':
          case 'deleteMessage':
            payload = {
              text: res.payload.body,
              chatId: res.payload.chat_id,
              messageId: res.payload.id,
              datetime: res.payload.sent_at,
              authorID: res.payload.user,
              files: res.payload.files,
              photos: res.payload.photos,
              sticker: res.payload.sticker,
            } as TMessageWS;
            break;
          
          case 'newChat':
            console.log(res.payload)  // Обработка нового типа
            payload = {
              chat_id: res.payload.id,
              avatar_path: res.payload.avatar_path ? res.payload.avatar_path : "",
              chat_type: res.payload.type,
              title: res.payload.title,
            } as NewChatWS;
            break;
          
          default:
            payload = res.payload;
        }

        const handlers = this.handlers[res.action] || [];
        handlers.forEach(handler => handler(payload));
        
      } catch (error) {
        console.error("WebSocket message error:", error);
      }
    };

    this.ws.onopen = () => {
      this.status = true;
    };

    this.ws.onclose = () => {
      this.status = false;
    };

    this.ws.onerror = (error: Event) => {
      console.error("WebSocket ошибка:", error);
    };
  }

  close() {
    if (!this.ws) {
      return;
    }
    this.ws.close();
    this.status = false;
    this.handlers = {};
    this.ws = null;

  }

  subscribe<T>(action: string, handler: THandler<T>) {
    if (!this.handlers[action]) this.handlers[action] = [];
    this.handlers[action].push(handler);
  }

  unsubscribe<T>(action: string, handler: THandler<T>) {
    if (!this.handlers[action]) return;
    this.handlers[action] = this.handlers[action].filter(h => h !== handler);
  }
}

export const wsConn = new wsConnection(websocketHost);
