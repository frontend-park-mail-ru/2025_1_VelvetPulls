import { dialogInfo } from "../../DialogInfo/index.js";
import { eventBus } from "../../../shared/modules/EventBus/EventBus.js";
import { Message } from "../../../entities/Message/model/Message.js";

class Dialog {
    constructor() {
        this.user = null;
        this.chatId = null;
        this.messages = [];
        this.container = null;

        this.infoIsOpen = false;

        eventBus.on("close dialog info", () => {
            this.infoIsOpen = false;
        });
    }

    setUser(user) {
        this.user = user;
        dialogInfo.setUser(user);
    }

    getHTML() {
        const data = {
            fullName: this.user.getFullName(),
            avatarSrc: this.user.avatarSrc,
            messages: this.messages,
        };

        const dialogTemplate = Handlebars.templates["Dialog.hbs"];
        const html = dialogTemplate({ ...data });

        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");
        const container = doc.body.firstChild;
        this.container = container;

        // const dialogInfoContainer = dialogInfo.getHTML();
        // const divider = container.querySelector(".vertical-divider");
        // divider.after(dialogInfoContainer);

        this.bindListeners();

        return container;
    }

    bindListeners() {
        const closeButton = this.container.querySelector("#close-chat");
        closeButton.addEventListener(
            "click",
            this.onClickButtonClose.bind(this),
        );

        const header = this.container.querySelector(".chat-header");
        header.addEventListener("click", this.onClickChatHeader.bind(this));

        const sendMessageButton = this.container.querySelector(
            "#send-message-button",
        );
        sendMessageButton.addEventListener(
            "click",
            this.onClickSendMessage.bind(this),
        );
    }

    onClickButtonClose(event) {
        event.preventDefault();
        event.stopPropagation();

        this.infoIsOpen = false;
        eventBus.emit("close dialog");
    }

    onClickChatHeader(event) {
        event.preventDefault();

        if (!this.infoIsOpen) {
            const groupInfoContainer = dialogInfo.getHTML();
            const divider = this.container.querySelector(".vertical-divider");
            divider.after(groupInfoContainer);
            this.infoIsOpen = true;
        }
    }

    async onClickSendMessage(event) {
        event.preventDefault();

        console.log("send message button click");

        const messageInput = this.container.querySelector(
            ".chat-input-container__input",
        );
        console.log("input value:", messageInput.value);

        if (messageInput.value === "") {
            alert("Сообщение не может быть пустым");
        } else {
            console.log("send message:", messageInput.value);

            const messageData = {
                body: messageInput.value,
                sentAt: "12:00",
            };
            const message = new Message(messageData);

            const messages = this.container.querySelector("#messages");
            messages.appendChild(message.getElement("my"));
            messages.appendChild(message.getElement("dialog"));
        }
    }
}

export const dialogInstace = new Dialog();
