// import e from "express";
// import { getMessageHistory, sendMessage } from "../api/api";

export class Message {
    // #ChatID;
    // #UserID;
    // #Body;
    // #SentAt;
    // #IsRedacted;
    // #AvatarPath;
    // #Username;

    constructor(data) {
        console.log("message data:", data);

        this.body = data["body"];
        this.sentAt = data["sentAt"];
    }

    // async MessageHistory() {
    //     const data = await getMessageHistory(this.#ChatID);
    //     return data;
    // }

    // async SendThisMessage(message) {
    //     const res = await sendMessage(this.#ChatID, message);
    //     return res;
    // }

    getElement(mode) {
        const data = {
            body: this.body,
            sentAt: this.sentAt,
        };

        let template = null;
        switch (mode) {
            case "my":
                template = Handlebars.templates["MyMessage.hbs"];
                break;

            case "dialog":
                template = Handlebars.templates["DialogMessage.hbs"];
                break;

            default:
                throw Error("Задан некорректный тип сообщения");
        }

        const html = template({ ...data });

        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");
        const element = doc.body.firstChild;

        this.element = element;
        console.log("message element:", element);

        return element;
    }
}

// export const MessageApi = new Message();
