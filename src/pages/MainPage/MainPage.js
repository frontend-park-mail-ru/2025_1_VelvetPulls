import { RenderResult } from "../../shared/helpers/RenderResponse.js";

import { auth } from "../../shared/api/auth.js";

import { addMembers } from "../../widgets/AddMembers/index.js";
import { chats } from "../../widgets/Chats/index.js";
import { contacts } from "../../widgets/Contacts/index.js";
import { createGroup } from "../../widgets/CreateGroup/index.js";
import { createContact } from "../../widgets/CreateContact/index.js";

import { profile } from "../../widgets/Profile/index.js";
import { editProfile } from "../../widgets/EditProfile/index.js";

import { noChat } from "../../widgets/NoChat/index.js";
import { dialogInstace } from "../../widgets/Dialog/index.js";
import { groupInstance } from "../../widgets/Group/index.js";

import { eventBus } from "../../shared/modules/EventBus/EventBus.js";
import { goToPage } from "../../shared/helpers/goToPage.js";

import { chatWebSocket } from "../../shared/api/websocket.js";

class MainPage {
    constructor() {
        this.sidebar = chats;
        this.chat = noChat;
        this.currentChatId = null;
        this.currentChatType = null;

        // Инициализация WebSocket
        chatWebSocket.connect();
        this.addListeners();
    }

    addListeners() {
        // --------------- chats ----------------------
        eventBus.on("ws:NEW_MESSAGE", (message) => {
            if (message.chatId === this.currentChatId) {
                this.handleNewMessage(message);
            }
        });

        eventBus.on("chats: click on chat", (chatId) => {
            this.currentChatId = chatId;
            this.loadChatHistory(chatId);
        });

        eventBus.on("new dialog", (user) => {
            dialogInstace.setUser(user);
            this.chat = dialogInstace;
            this.currentChatType = "dialog";
            this.render();
        });

        eventBus.on("chat is deleted", () => {
            console.log("catch chat is deleted");
            this.render();
        });

        eventBus.on("new chat is created", () => {
            console.log("catch new chat is created");
            this.render();
        });

        eventBus.on("open dialog", async ({ user, chatId }) => {
            console.log("catch open dialog:", user, chatId);

            await dialogInstace.init({ user, chatId });
            this.chat = dialogInstace;
            this.render();
        });

        eventBus.on("open group", async (chatId) => {
            await groupInstance.getData(chatId);
            this.chat = groupInstance;
            this.render();
        });

        eventBus.on("chats -> profile", () => {
            this.sidebar = profile;
            this.render();
        });

        eventBus.on("chats -> contacts", () => {
            this.sidebar = contacts;
            this.render();
        });

        eventBus.on("chats -> new group", () => {
            this.sidebar = createGroup;
            this.render();
        });

        eventBus.on("chats -> new contact", () => {
            this.sidebar = createContact;
            this.render();
        });

        // eventBus.on("chats: click on chat", () => {
        //     this.chat = group;
        //     this.render();
        // });

        // eventBus.on("new dialog", (user) => {
        //     console.log("catch new dialog", user);
        //     dialog.setUser(user);
        //     this.chat = dialog;
        //     this.render();
        // });

        eventBus.on("new dialog", (user) => {
            console.log("catch new dialog", user);
            dialogInstace.setUser(user);
            this.chat = dialogInstace;
            this.render();
        });

        // --------------- profile -----------------------

        eventBus.on("profile -> chats", () => {
            this.sidebar = chats;
            this.render();
        });

        eventBus.on("profile -> edit profile", () => {
            this.sidebar = editProfile;
            this.render();
        });

        eventBus.on("profile -> logout", () => {
            auth.logout();
            goToPage("login");
        });

        // --------------- edit profile ----------------------

        eventBus.on("edit profile -> back", () => {
            this.sidebar = profile;
            this.render();
        });

        eventBus.on("edit profile -> save", () => {
            this.sidebar = profile;
            this.render();
        });

        // ------------------- contacts ----------------------

        eventBus.on("contacts -> chats", () => {
            this.sidebar = chats;
            this.render();
        });

        // ------------------- new group ----------------------

        eventBus.on("new group -> chats", () => {
            this.sidebar = chats;
            this.render();
        });

        eventBus.on("new group -> add members", () => {
            this.sidebar = addMembers;
            this.render();
        });

        // ----------------- add members ----------------------

        eventBus.on("add members -> new group", () => {
            this.sidebar = createGroup;
            this.render();
        });

        eventBus.on("add members -> next", () => {
            this.sidebar = chats;
            this.render();
        });

        // ------------------- new contact ----------------------

        eventBus.on("new contact -> chats", () => {
            this.sidebar = chats;
            this.render();
        });

        // ------------------- dialog -----------------------
        eventBus.on("close dialog", () => {
            console.log("close dialog");
            this.chat = noChat;
            this.currentChatType = null;
            this.render();
        });
    }

    async loadChatHistory(chatId) {
        // try {
        //     const response = await api.get(`/chat/${chatId}/messages`);
        //     // Обработка истории сообщений
        //     this.renderMessages(response.data);
        // } catch (error) {
        //     console.error("Failed to load chat history:", error);
        // }
        console.log("load chat histori for chatId:", chatId);
    }

    handleNewMessage(message) {
        const messagesContainer = document.querySelector(".messages-container");
        if (messagesContainer) {
            const messageElement = this.createMessageElement(message);
            messagesContainer.appendChild(messageElement);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    }
    // updateListeners() {
    //     const callback = () => {
    //         group.infoIsOpen = false;
    //         this.chat = noChat;
    //         this.render();
    //     };

    //     const goToNoChat = function (event) {
    //         event.preventDefault();

    //         if (event.key === "Escape") {
    //             callback();
    //         }

    //         document.removeEventListener("keydown", goToNoChat);
    //     };

    //     if (this.chat !== noChat) {
    //         document.addEventListener("keydown", goToNoChat);
    //     }
    // }

    async render() {
        const mainPageTemplate = Handlebars.templates["MainPage.hbs"];
        const html = mainPageTemplate({});

        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");

        const container = doc.body.firstChild;

        const sidebar = await this.sidebar.getHTML();
        container.insertBefore(sidebar, container.firstChild);

        const divider = container.querySelector(".container__divider");
        const chat = this.chat.getHTML();
        divider.after(chat);

        const root = document.getElementById("root");
        root.innerHTML = "";
        root.appendChild(container);

        // this.updateListeners();

        return new RenderResult({});
    }
}

export const mainPage = new MainPage();
