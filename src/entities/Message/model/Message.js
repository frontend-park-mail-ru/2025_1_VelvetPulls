import { getAvatar } from "../../../shared/helpers/getAvatar.js";

export class Message {
    constructor({
        id,
        chat_id,
        user_id,
        body,
        sent_at,
        is_redacted = false,
        avatar_path = null,
        isMine = false,
        user = null,
    }) {
        this.id = id;
        this.chatId = chat_id;
        this.userId = user_id;
        this.body = body;
        this.sentAt = new Date(sent_at);
        this.isRedacted = is_redacted;
        this.avatarPath = avatar_path;
        this.isMine = isMine; // Флаг, указывающий, принадлежит ли сообщение текущему пользователю
        this.username = user;
    }

    // Форматирование времени для отображения
    getTime() {
        return this.sentAt.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });
    }

    // Форматирование даты для отображения (если нужно)
    getDate() {
        return this.sentAt.toLocaleDateString();
    }

    // Проверка, является ли сообщение "моим"
    setIsMine(currentUserId) {
        this.isMine = this.userId === currentUserId;
        return this;
    }

    // Обновление содержимого сообщения (например, при редактировании)
    updateBody(newBody) {
        this.body = newBody;
        this.isRedacted = true;
        return this;
    }

    // Преобразование в объект для API (если нужно отправить на сервер)
    toApiFormat() {
        return {
            id: this.id,
            chat_id: this.chatId,
            user_id: this.userId,
            body: this.body,
            sent_at: this.sentAt.toISOString(),
            is_redacted: this.isRedacted,
            avatar_path: this.avatarPath,
        };
    }

    async getElement(mode) {
        const data = {
            body: this.body,
            sentAt: this.getTime(),
            username: this.username,
            avatarSrc: await getAvatar(this.avatarPath),
        };

        let template = null;
        switch (mode) {
            case "my":
                template = Handlebars.templates["MyMessage.hbs"];
                break;

            case "dialog":
                template = Handlebars.templates["DialogMessage.hbs"];
                break;

            case "group":
                template = Handlebars.templates["GroupMessage.hbs"];
                break;

            default:
                throw Error("Задан некорректный тип сообщения");
        }

        const html = template({ ...data });

        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");
        const element = doc.body.firstChild;

        this.element = element;
        // console.log("message element:", element);

        return element;
    }

    // Статический метод для создания экземпляра из данных API
    static fromApi(data) {
        const message = new Message(data);
        // if (currentUserId) {
        //     message.setIsMine(currentUserId);
        // }
        return message;
    }
}
