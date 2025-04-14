import { eventBus } from "../../../shared/modules/EventBus/EventBus.js";
import { api } from "../../../shared/api/api.js";

class Contacts {
    constructor(parentWidget) {
        this.parentWidget = parentWidget;
        this.container = null;
    }

    async getData() {
        const response = await api.get("/contacts");
        this.data = response.data;
    }

    async getHTML() {
        await this.getData();

        const template = Handlebars.templates["Contacts.hbs"];

        const contacts = [];
        for (const contact of this.data) {
            contacts.push({
                name: contact.username,
            });
        }

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

                const contactUser = this.data[i];

                const responseBody = {
                    username: contactUser.username,
                };

                await api.delete("/contacts", responseBody);

                contactElement.parentNode.removeChild(contactElement);
            });
        }
    }
}

export const contacts = new Contacts();
