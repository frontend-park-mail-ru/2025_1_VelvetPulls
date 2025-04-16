import { groupInfo } from "../../GroupInfo/ui/GroupInfo.js";
import { api } from "../../../shared/api/api.js";
import { getAvatar } from "../../../shared/helpers/getAvatar.js";
import { eventBus } from "../../../shared/modules/EventBus/EventBus.js";

class EditGroup {
    constructor() {}

    setData(data) {
        this.chatId = data.chatId;
        this.title = data.title;
        this.countUsers = data.count_users;
        this.avatarSrc = data.avatarSrc;
    }

    render() {
        const container = this.getHTML();

        const chatContainer = document.querySelector(".chat-container");
        const sidebar = chatContainer.lastElementChild;

        chatContainer.removeChild(sidebar);
        chatContainer.appendChild(container);
    }

    getHTML() {
        Handlebars.registerHelper("eq", (a, b) => a == b);

        const data = {
            // avatarSrc: this.avatarSrc,
            title: this.title,
        };

        const template = Handlebars.templates["EditGroup.hbs"];
        const html = template({ ...data });

        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");
        const container = doc.body.firstChild;
        this.container = container;

        this.addListeners();

        return container;
    }

    addListeners() {
        const buttonClose = this.container.querySelector("#close-edit-group");
        buttonClose.addEventListener(
            "click",
            this.onBackButtonClick.bind(this),
        );

        const saveButton = this.container.querySelector("#save-edit-group");
        saveButton.addEventListener("click", this.onSaveButtonClick.bind(this));
    }

    onBackButtonClick(event) {
        event.preventDefault();

        groupInfo.render();
    }

    async onSaveButtonClick(event) {
        event.preventDefault();

        const titleInput = this.container.querySelector("#title-input");
        const title = titleInput.value;

        const avatarInput = this.container.querySelector("#avatar-input");
        const avatarFile =
            avatarInput.files.length > 0 ? avatarInput.files[0] : null;

        const formData = new FormData();

        if (avatarFile !== null) {
            formData.append("avatar", avatarFile);
        }

        if (this.title !== title) {
            const chatData = {
                title: title,
            };

            formData.append("chat_data", JSON.stringify(chatData));
        }

        if (formData.entries().next().done) {
            return;
        }

        const response = await api.put(`/chat/${this.chatId}`, formData);

        const avatarSrc = await getAvatar(response.data["avatar_path"]);

        // Обновить данные в EditGroup
        this.title = title;
        this.avatarSrc = avatarSrc;

        const data = {
            title: title,
            avatarSrc: avatarSrc,
            chatId: this.chatId,
        };

        // Обновить данные там, где нужно
        eventBus.emit("group is edited", data);
    }
}

export const editGroup = new EditGroup();
