import { api } from "../../../shared/api/api.js";
import { eventBus } from "../../../shared/modules/EventBus/EventBus.js";
import { Message } from "../../../entities/Message/index.js";
import {
    sendMessage,
    getMessageHistory,
} from "../../../entities/Message/index.js";
import { currentUser } from "../../../entities/User/model/User.js";
import { chatWebSocket } from "../../../shared/api/websocket.js";
import { groupInfo } from "../../GroupInfo/index.js";

class Group {
    constructor() {
        this.infoIsOpen = false;

        eventBus.on("group-info: close", () => {
            this.infoIsOpen = false;
        });
    }

    async getData(chatId) {
        this.chatId = chatId;

        const responseBody = await api.get(`/chat/${chatId}`);

        const data = responseBody.data;
        this.title = data.title;
        this.countUsers = data.count_users;

        this.messages = (await getMessageHistory(chatId)).data;

        groupInfo.getData(data);
    }

    async getHTML() {
        const data = {
            title: this.title,
            countUsers: this.countUsers,
            // avatarSrc: this.user.avatarSrc,
        };

        const groupTemplate = Handlebars.templates["Group.hbs"];
        const html = groupTemplate({ ...data });

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
                    messages.appendChild(await message.getElement("group"));
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
            const groupInfoContainer = groupInfo.getHTML();
            const divider = this.container.querySelector(".vertical-divider");
            divider.after(groupInfoContainer);
            this.infoIsOpen = true;
        }
    }

    async onClickSendMessage(event) {
        event.preventDefault();

        const messageInput = this.container.querySelector(
            ".chat-input-container__input",
        );

        if (messageInput.value !== "") {
            await sendMessage(this.chatId, messageInput.value);

            const messageData = {
                body: messageInput.value,
                sent_at: new Date(),
            };
            const message = new Message(messageData);
            const messages = this.container.querySelector("#messages");
            messages.appendChild(await message.getElement("my"));

            messageInput.value = "";

            messages.scrollTop = messages.scrollHeight;

            chatWebSocket.send(message);
        }
    }
}

export const groupInstance = new Group();
