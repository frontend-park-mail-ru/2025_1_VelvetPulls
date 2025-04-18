import { eventBus } from "../../../shared/modules/EventBus/EventBus.js";
import { api } from "../../../shared/api/api.js";
import { createChat } from "../../../entities/Chat/api/api.js";
import { getAvatar } from "../../../shared/helpers/getAvatar.js";
import { chatWebSocket } from "../../../shared/api/websocket.js";

class AddMembers {
    setGroupInfo(info) {
        this.title = info.title;
        // this.avatarSrc =
    }

    async getData() {
        const response = await api.get("/contacts");
        this.contacts = response.data;
    }

    async getHTML() {
        await this.getData();

        const template = Handlebars.templates["AddMembers.hbs"];

        const contacts = [];
        if (this.contacts !== null) {
            for (const contact of this.contacts) {
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

        const container = doc.body.firstChild;
        this.container = container;

        this.addListeners();

        return container;
    }

    addListeners() {
        // Назад (создать группу)
        const buttonBack = this.container.querySelector("#button-back");
        buttonBack.addEventListener("click", (event) => {
            event.preventDefault();
            eventBus.emit("add members -> new group");
        });

        const memberItems =
            this.container.querySelectorAll(".sidebar-list-item");
        for (const memberItem of memberItems) {
            memberItem.addEventListener("click", (event) => {
                const checkbox = memberItem.querySelector("input");

                if (event.target !== checkbox) {
                    checkbox.checked = !checkbox.checked;
                }
            });
        }

        // Далее (завершить создание чата)
        const buttonNext = this.container.querySelector(
            ".sidebar__fixed-button",
        );
        buttonNext.addEventListener("click", this.onClickButtonNext.bind(this));
    }

    async onClickButtonNext(event) {
        event.preventDefault();

        // Создать группу
        const chatData = {
            type: "group",
            title: this.title,
        };
        const responseBody = await createChat(chatData);

        chatWebSocket.reconnect();

        const chatId = responseBody.data.id;

        // Добавить участников
        const members = [];
        const checkboxes = this.container.querySelectorAll(
            ".add-member__checkbox",
        );
        for (let i = 0; i < checkboxes.length; ++i) {
            const checkbox = checkboxes[i];
            const contact = this.contacts[i];

            if (checkbox.checked) {
                members.push(contact.username);
            }
        }
        await api.post(`/chat/${chatId}/users`, members);
        eventBus.emit("add members -> next");
    }
}

export const addMembers = new AddMembers();
