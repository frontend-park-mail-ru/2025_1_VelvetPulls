import { eventBus } from "../../../shared/modules/EventBus/EventBus.js";
import { api } from "../../../shared/api/api.js";
import { getAvatar } from "../../../shared/helpers/getAvatar.js";

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
        if (this.data !== null) {
            for (const contact of this.data) {
                const username = contact["username"];

                const avatarPath = contact["avatar_path"];
                const avatarSrc = await getAvatar(avatarPath);

                contacts.push({
                    username: username,
                    avatarSrc: avatarSrc,
                });
            }
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
