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
// import { dialog } from "../../widgets/Dialog/index.js";
import { group } from "../../widgets/Group/index.js";

import { eventBus } from "../../shared/modules/EventBus/EventBus.js";
import { goToPage } from "../../shared/helpers/goToPage.js";

class MainPage {
    constructor() {
        this.sidebar = chats;
        this.chat = noChat;

        this.addListeners();
    }

    addListeners() {
        // --------------- chats ----------------------

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

        eventBus.on("chats: click on chat", () => {
            this.chat = group;
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
    }

    updateListeners() {
        const callback = () => {
            group.infoIsOpen = false;
            this.chat = noChat;
            this.render();
        };

        const goToNoChat = function (event) {
            event.preventDefault();

            if (event.key === "Escape") {
                callback();
            }

            document.removeEventListener("keydown", goToNoChat);
        };

        if (this.chat !== noChat) {
            document.addEventListener("keydown", goToNoChat);
        }
    }

    async render() {
        const mainPageTemplate = Handlebars.templates["MainPage.hbs"];
        const html = mainPageTemplate({});

        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");

        const container = doc.body.firstChild;

        const sidebar = this.sidebar.getHTML();
        container.insertBefore(sidebar, container.firstChild);

        const divider = container.querySelector(".container__divider");
        const chat = this.chat.getHTML();
        divider.after(chat);

        const root = document.getElementById("root");
        root.innerHTML = "";
        root.appendChild(container);

        this.updateListeners();

        return new RenderResult({});
    }
}

export const mainPage = new MainPage();
