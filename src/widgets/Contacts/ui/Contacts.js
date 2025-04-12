import { eventBus } from "../../../shared/modules/EventBus/EventBus.js";
import { chatsapi } from "../../../shared/api/chats.js";

class Contacts {
    constructor(parentWidget) {
        this.parentWidget = parentWidget;
        this.container = null;
    }
    getHTML() {
        chatsapi.getContacts()
        this.data=chatsapi.getCon

        const template = Handlebars.templates["Contacts.hbs"];
        const contacts = this.data;
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
        for (const contact of contacts) {
            const deleteButton = contact.querySelector(".button");
            deleteButton.addEventListener("click", (event) => {
                event.preventDefault();
                let r=contact.querySelector(".sidebar-list-item__full-name").innerHTML
                chatsapi.deleteAjax(r)
            });
        }
    }
}

export const contacts = new Contacts();
