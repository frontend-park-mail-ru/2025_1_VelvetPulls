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
            title: this.title,
            avatarSrc: this.avatarSrc,
        };

        const template = Handlebars.templates["EditGroup.hbs"];
        const html = template({ ...data });

        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");

        const fileInput1 = doc.querySelector("#fileInput1");
        const avatarContainer = doc.querySelector(".avatar-container-upload");
        const avatarImage = doc.getElementById("avatarImage");

        avatarContainer.addEventListener("click", function () {
            fileInput1.click(); // Открываем диалог выбора файла
        });

        fileInput1.addEventListener("change", function (event) {
            const file = event.target.files[0];
            this.avatar = file;
            if (file) {
                const reader = new FileReader();

                reader.onload = function (e) {
                    avatarImage.src = e.target.result; // Устанавливаем выбранное фото
                };

                reader.readAsDataURL(file); // Читаем файл как Data URL
            }
        });

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

        // const avatarInput = this.container.querySelector("#avatar-input");
        const avaImg = this.container.querySelector("#fileInput1");
        const avatarFile = avaImg.files.length > 0 ? avaImg.files[0] : null;

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
        document.querySelector(".chat-header__full-name").innerHTML=title
        //eventBus.emit("close dialog");
        groupInfo.render();
        eventBus.emit("group is edited", data);

        
        document.querySelector(".user-info__full-name").innerHTML=title
    }
}

export const editGroup = new EditGroup();
