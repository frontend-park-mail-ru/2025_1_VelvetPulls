import { dialogInfo } from "../../DialogInfo/index.js";
import { eventBus } from "../../../shared/modules/EventBus/EventBus.js";
import { createChat } from "../../../entities/Chat/api/api.js";

class DialogView {
    constructor() {
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

        // const deleteChatButton = this.container.querySelector(
        //     "#delete-chat-button",
        // );
        // deleteChatButton.addEventListener(
        //     "click",
        //     this.onClickDeleteChat.bind(this),
        // );
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
        console.log("onClickSendMessage: this:", this);
        console.log("onClickSendMessage: this container:", this.container);

        const messageInput = this.container.querySelector(
            ".chat-input-container__input",
        );
        console.log("input value:", messageInput.value);

        if (messageInput.value === "") {
            alert("Сообщение не может быть пустым");
        } else {
            console.log("TODO: create chat");
            const chatData = {
                type: "dialog",
                dialog_user: this.user.getUsername(),
                title: "1",
            };
            await createChat(chatData);

            eventBus.emit("new chat is created");
            // console.log("TODO: send message");
        }
    }

    // onClickDeleteChat(event) {
    //     event.preventDefault();
    //     event.stopPropagation();

    //     console.log("TODO: delete chat if exists");
    // }
}

export const dialogViewInstace = new DialogView();
