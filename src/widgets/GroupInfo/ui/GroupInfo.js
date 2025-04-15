import { currentUser } from "../../../entities/User/model/User.js";
import { eventBus } from "../../../shared/modules/EventBus/EventBus.js";
import { editGroup } from "../../EditGroup/index.js";

class GroupInfo {
    constructor() {
        eventBus.on("group is edited", this.onGroupEdit.bind(this));
    }

    async setData(data) {
        this.chatId = data.id;
        this.title = data.title;
        this.countUsers = data.countUsers;
        this.avatarSrc = data.avatarSrc;
        this.users = data.users;

        this.isOwner = false;
        for (const user of data.users) {
            if (
                user.role === "owner" &&
                user.username === currentUser.getUsername()
            ) {
                this.isOwner = true;
                break;
            }
        }

        console.log("is owner:", this.isOwner);

        editGroup.setData(data);
    }

    render() {
        const chatContainer = document.querySelector(".chat-container");
        const sidebar = chatContainer.lastElementChild;

        const container = this.getHTML();
        if (sidebar.classList.contains("sidebar")) {
            chatContainer.removeChild(sidebar);
        }
        chatContainer.appendChild(container);
    }

    getHTML() {
        Handlebars.registerHelper("eq", (a, b) => a == b);

        const context = {
            avatarSrc: this.avatarSrc,
            title: this.title,
            members: this.users,
            membersCount: this.countUsers,
            isOwner: this.isOwner,
        };

        const template = Handlebars.templates["GroupInfo.hbs"];
        const html = template({ ...context });

        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");
        const container = doc.body.firstChild;
        this.container = container;

        this.addListeners();

        return container;
    }

    addListeners() {
        const buttonClose = this.container.querySelector("#close-chat-info");
        buttonClose.addEventListener("click", (event) => {
            event.preventDefault();

            this.container.parentElement.removeChild(this.container);
            eventBus.emit("group-info: close", {});
        });

        const buttonEdit = this.container.querySelector("#edit-group-button");
        buttonEdit.addEventListener("click", this.onClickEditGroup.bind(this));
    }

    onClickEditGroup(event) {
        event.preventDefault();

        editGroup.render();
    }

    onGroupEdit(data) {
        this.title = data.title;
        this.avatarSrc = data.avatarSrc;

        const container = this.container;

        const title = container.querySelector(".user-info__full-name");
        title.innerHTML = this.title;

        const avatar = container.querySelector(".avatar-container__image");
        avatar.src = this.avatarSrc;
    }
}

export const groupInfo = new GroupInfo();
