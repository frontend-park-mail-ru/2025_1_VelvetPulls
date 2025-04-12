export class ChatWebSocket {
    constructor(url, messageHandler) {
        this.url = url;
        this.messageHandler = messageHandler;
        this.socket = null;
        this.connect();
    }

    connect() {
        this.socket = new WebSocket(this.url);

        this.socket.onopen = () => {
            console.log('WebSocket connected');
            this.connected = true;
            this.reconnectAttempts = 0;
        };
        this.socket.onmessage = (event) => {
            try {
                const message = JSON.parse(event.data);
                this.messageHandler(message);
            } catch (error) {
                console.error('Error parsing message:', error);
            }
        };

        this.socket.onclose = () => {
            this.connected = false;
            console.log('WebSocket disconnected');
            this.tryReconnect();
        };
      
        this.socket.onerror = (error) => {
            console.error('WebSocket error:', error);
        };
    }

    tryReconnect() {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
          this.reconnectAttempts++;
          const delay = Math.min(1000 * this.reconnectAttempts, 5000);
          
          console.log(`Reconnecting in ${delay}ms...`);
          setTimeout(() => this.connect(), delay);
        } else {
          console.error('Max reconnection attempts reached');
        }
    }
    
    sendMessage(message) {
        if (this.connected) {
          this.socket.send(JSON.stringify(message));
        } else {
          console.error('Cannot send message - WebSocket not connected');
        }
    }
    
    disconnect() {
        if (this.socket) {
          this.socket.close();
        }
    }
}