import { dialogInfo } from "../../DialogInfo/index.js";
import { eventBus } from "../../../shared/modules/EventBus/EventBus.js";
import { Message } from "../../../entities/Message/model/Message.js";
import {
    getMessageHistory,
    sendMessage,
} from "../../../entities/Message/index.js";
import { currentUser } from "../../../entities/User/model/User.js";
import { chatWebSocket } from "../../../shared/api/websocket.js";

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

    async init({ user, chatId }) {
        this.chatId = chatId;
        this.user = user;

        this.messages = (await getMessageHistory(chatId)).data;

        dialogInfo.setUser(user);
    }

    async getHTML() {
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

        const messages = this.container.querySelector("#messages");
        console.log("this messages:", this.messages);
        if (this.messages !== null) {
            for (const messageItem of this.messages) {
                console.log("messageItem:", messageItem);

                const message = new Message(messageItem);
                console.log("message:", message);
                console.log("current user:", currentUser);

                if (messageItem.user === currentUser.getUsername()) {
                    messages.appendChild(await message.getElement("my"));
                } else {
                    messages.appendChild(await message.getElement("dialog"));
                }

                messages.scrollTop = messages.scrollHeight;
            }
        }

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

        if (messageInput.value !== "") {
            console.log("send message:", messageInput.value);

            const response = await sendMessage(this.chatId, messageInput.value);

            console.log("chatId:", this.chatId);
            console.log("send message:", response);

            const messageData = {
                body: messageInput.value,
                sentAt: new Date().getTime(),
            };
            const message = new Message(messageData);
            const messages = this.container.querySelector("#messages");
            messages.appendChild(await message.getElement("my"));

            messages.scrollTop = messages.scrollHeight;

            chatWebSocket.send(message);
        }
    }
}

export const dialogInstace = new Dialog();
