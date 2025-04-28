import { eventBus } from "../../../shared/modules/EventBus/EventBus.js";
import { api } from "../../../shared/api/api.js";

import { getProfile } from "../lib/getProfile.js";
import { getContacts } from "../lib/getContacts.js";
import { getChats } from "../lib/getChats.js";
import { createChat } from "../lib/createChat.js";

import { chatWebSocket } from "../../../shared/api/websocket.js";

const IS_AUTHORIZED = "isAuthorized";

class Store {
    constructor() {
        this.profile = null;
        this.contacts = null;
        this.chats = null;

        eventBus.on("init store", this.init.bind(this));

        // profile
        eventBus.on("profile: update", this.updateProfile.bind(this));

        // contacts
        eventBus.on("contacts: create", this.createContact.bind(this));
        eventBus.on("contacts: delete", this.deleteContact.bind(this));

        // chats
        eventBus.on("delete chat", this.deleteChat.bind(this));
        eventBus.on("create dialog", this.createDialog.bind(this));
        eventBus.on("create group", this.createGroup.bind(this));
    }

    async init() {
        this.profile = await getProfile();

        if (this.profile == null) {
            eventBus.emit("logout");
        } else {
            this.contacts = await getContacts();
            this.chats = await getChats(this.profile);

            localStorage.setItem(IS_AUTHORIZED, true);
        }
    }

    clear() {
        this.profile = null;
        this.contacts = null;
        this.chats = null;

        localStorage.setItem(IS_AUTHORIZED, false);
    }

    // ------ profile ------

    async updateProfile(formData) {
        await api.put("/profile", formData);
        this.profile = await getProfile();
        eventBus.emit("store: profile updated");
    }

    // ------ contacts ------

    async createContact(username) {
        const requestBody = {
            username: username,
        };
        const response = await api.post("/contacts", requestBody);
        this.contacts = await getContacts();

        if (response.status === false) {
            eventBus.emit("store: contact not found", username);
        } else {
            eventBus.emit("store: contacts updated");
        }
    }

    async deleteContact(username) {
        const requestBody = {
            username: username,
        };

        await api.delete("/contacts", requestBody);
        this.contacts = await getContacts();

        eventBus.emit("store: contacts updated");
    }

    // ------ chats ------

    async deleteChat(chatId) {
        await api.delete(`/chat/${chatId}`);
        this.chats = await getChats(this.profile);

        eventBus.emit("store: chats updated");
    }

    async createDialog(username) {
        const chatData = {
            type: "dialog",
            dialog_user: username,
            title: "1",
        };
        await createChat(chatData);

        chatWebSocket.reconnect();

        this.chats = await getChats(this.profile);

        eventBus.emit("new chat is created");
    }

    async createGroup(groupData) {
        // Создать группу
        const chatData = {
            type: "group",
            title: groupData.title,
        };
        const responseBody = await createChat(chatData);

        chatWebSocket.reconnect();

        const chatId = responseBody.data["id"];

        // Добавить участников
        await api.post(`/chat/${chatId}/users`, groupData.members);

        this.chats = await getChats(this.profile);

        eventBus.emit("new chat is created");
    }
}

export const store = new Store();
