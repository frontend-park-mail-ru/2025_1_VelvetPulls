import { eventBus } from "../../../shared/modules/EventBus/EventBus.js";
import { store } from "../../../app/store/index.js";

class Contacts {
    constructor(parentWidget) {
        this.parentWidget = parentWidget;
        this.container = null;
    }

    async getHTML() {
        const contacts = store.contacts;

        const template = Handlebars.templates["Contacts.hbs"];
        const html = template({ contacts });

        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");

        const domElement = doc.body.firstChild;

        this.container = domElement;

        this.addListeners();

        return domElement;
    }

    addListeners() {
        const back = this.container.querySelector("#button-back");

        back.addEventListener("click", (event) => {
            event.preventDefault();
            eventBus.emit("contacts -> chats");
        });

        const contacts = this.container.querySelectorAll(".sidebar-list-item");
        for (let i = 0; i < contacts.length; ++i) {
            const contactElement = contacts[i];

            const deleteButton = contactElement.querySelector(".button");
            deleteButton.addEventListener("click", async (event) => {
                event.preventDefault();
                event.stopPropagation();

                const contactUser = store.contacts[i];

                eventBus.emit("contacts: delete", contactUser.username);
            });
        }
    }
}

export const contacts = new Contacts();
