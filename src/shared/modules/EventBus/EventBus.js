class EventBus {
    constructor() {
        this.listeners = {};
    }

    // Подписаться
    on(event, callback) {
        if (this.listeners[event] == undefined) {
            this.listeners[event] = {};

            this.listeners[event].eventProperty = {};
            this.listeners[event].eventProperty.isOnOnce = false;

            this.listeners[event].data = [];
        }
        this.listeners[event].data.push(callback);
        // console.log("on", event);
    }

    // Подписаться единожды
    onOnce(event, callback) {
        this.on(event, callback);
        this.listeners[event].eventProperty.isOnOnce = true;
    }

    // Отписаться
    off(event, callback) {
        this.listeners[event] = this.listeners[event].data.filter(
            function (listener) {
                return listener !== callback;
            },
        );
    }

    // Разослать сообщение подписчикам
    emit(event, data = null) {
        if (
            this.listeners[event] == undefined ||
            this.listeners[event].data == undefined
        ) {
            return;
        }

        let itObj = this;

        this.listeners[event].data.forEach((listener) => {
            if (itObj.listeners[event].eventProperty.isOnOnce) {
                itObj.off(event, itObj.listeners[event].data[0]);
            }
            listener(data);
        });
    }
}

export const eventBus = new EventBus();
