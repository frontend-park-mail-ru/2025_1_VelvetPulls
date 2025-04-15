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
import { currentUser } from "../../entities/User/model/User.js";

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

        eventBus.on("ws:NEW_MESSAGE", async (message) => {
            if (message.chatId === this.currentChatId) {
                await this.handleNewMessage(message);
            }
        });

        eventBus.on("new dialog", (user) => {
            dialogInstace.setUser(user);
            this.chat = dialogInstace;
            this.currentChatType = "dialog";
            goToPage("main");
        });

        eventBus.on("chat is deleted", () => {
            goToPage("main");
        });

        eventBus.on("new chat is created", () => {
            goToPage("main");
        });

        eventBus.on("open dialog", async ({ user, chatId }) => {
            this.currentChatId = chatId;
            this.currentChatType = "dialog";
            await dialogInstace.init({ user, chatId });
            this.chat = dialogInstace;
            goToPage("main");
        });

        eventBus.on("open group", async (chatId) => {
            this.currentChatId = chatId;
            this.currentChatType = "group";

            await groupInstance.getData(chatId);
            this.chat = groupInstance;
            goToPage("main");
        });

        eventBus.on("chats -> profile", () => {
            this.sidebar = profile;
            goToPage("main");
        });

        eventBus.on("chats -> contacts", () => {
            this.sidebar = contacts;
            goToPage("main");
        });

        eventBus.on("chats -> new group", () => {
            this.sidebar = createGroup;
            goToPage("main");
        });

        eventBus.on("chats -> new contact", () => {
            this.sidebar = createContact;
            goToPage("main");
        });

        eventBus.on("new dialog", (user) => {
            dialogInstace.setUser(user);
            this.chat = dialogInstace;
            goToPage("main");
        });

        // --------------- profile -----------------------

        eventBus.on("profile -> chats", () => {
            this.sidebar = chats;
            goToPage("main");
        });

        eventBus.on("profile -> edit profile", () => {
            this.sidebar = editProfile;
            goToPage("main");
        });

        eventBus.on("profile -> logout", () => {
            auth.logout();
            goToPage("login");
            this.sidebar = chats;
        });

        // --------------- edit profile ----------------------

        eventBus.on("edit profile -> back", () => {
            this.sidebar = profile;
            goToPage("main");
        });

        eventBus.on("edit profile -> save", () => {
            this.sidebar = profile;
            goToPage("main");
        });

        // ------------------- contacts ----------------------

        eventBus.on("contacts -> chats", () => {
            this.sidebar = chats;
            goToPage("main");
        });

        // ------------------- new group ----------------------

        eventBus.on("new group -> chats", () => {
            this.sidebar = chats;
            goToPage("main");
        });

        eventBus.on("new group -> add members", (groupInfo) => {
            addMembers.setGroupInfo(groupInfo);
            this.sidebar = addMembers;
            goToPage("main");
        });

        // ----------------- add members ----------------------

        eventBus.on("add members -> new group", () => {
            this.sidebar = createGroup;
            goToPage("main");
        });

        eventBus.on("add members -> next", () => {
            this.sidebar = chats;
            goToPage("main");
        });

        // ------------------- new contact ----------------------

        eventBus.on("new contact -> chats", () => {
            this.sidebar = chats;
            goToPage("main");
        });

        // ------------------- dialog -----------------------

        eventBus.on("close dialog", () => {
            this.chat = noChat;
            this.currentChatType = null;
            goToPage("main");
        });
    }

    async handleNewMessage(message) {
        const messagesContainer = document.querySelector("#messages");
        if (messagesContainer) {
            let messageType = null;
            if (message.username === currentUser.getUsername()) {
                messageType = "my";
            } else {
                messageType = this.currentChatType;
            }
            const messageElement = await message.getElement(messageType);
            messagesContainer.appendChild(messageElement);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    }

    async render() {
        const mainPageTemplate = Handlebars.templates["MainPage.hbs"];
        const html = mainPageTemplate({});

        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");
        const container = doc.body.firstChild;

        const sidebar = await this.sidebar.getHTML();
        container.insertBefore(sidebar, container.firstChild);

        const divider = container.querySelector(".container__divider");
        const chat = await this.chat.getHTML();
        divider.after(chat);

        const root = document.getElementById("root");
        root.innerHTML = "";
        root.appendChild(container);

        return new RenderResult({});
    }
}

export const mainPage = new MainPage();
