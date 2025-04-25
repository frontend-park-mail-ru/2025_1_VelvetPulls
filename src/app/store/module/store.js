import { eventBus } from "../../../shared/modules/EventBus/EventBus.js";
import { api } from "../../../shared/api/api.js";

import { getProfile } from "../lib/getProfile.js";

import { getContacts } from "../lib/getContacts.js";

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
    }

    async init() {
        this.profile = await getProfile();
        this.contacts = await getContacts();
    }

    clear() {
        this.profile = null;
        this.contacts = null;
        this.chats = null;
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
            alert(`Пользователь ${username} не найден`);
            eventBus.emit("new contact -> chats");
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
}

export const store = new Store();
