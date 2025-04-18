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
        if (this.messages !== null) {
            for (const messageItem of this.messages) {
                const message = new Message(messageItem);

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
            this.sendMessage.bind(this),
        );

        const inputMessage = this.container.querySelector(
            "#send-message-input",
        );
        inputMessage.addEventListener("keypress", (event) => {
            if (event.key === "Enter") {
                this.sendMessage(event);
            }
        });
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

    async sendMessage(event) {
        event.preventDefault();

        const messageInput = this.container.querySelector(
            ".chat-input-container__input",
        );

        if (messageInput.value !== "") {
            await sendMessage(this.chatId, messageInput.value);

            const messageData = {
                body: messageInput.value,
                sent_at: new Date(),
                user: currentUser.getUsername(),
            };
            const message = new Message(messageData);

            chatWebSocket.send(message);

            messageInput.value = "";
        }
    }
}

export const dialogInstace = new Dialog();
