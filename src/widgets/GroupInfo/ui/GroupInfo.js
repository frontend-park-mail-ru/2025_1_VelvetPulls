import { eventBus } from "../../../shared/modules/EventBus/EventBus.js";
import { editGroup } from "../../EditGroup/index.js";

class GroupInfo {
    constructor() {}

    getData(data) {
        this.chatId = data.id;
        this.title = data.title;
        this.countUsers = data.count_users;
        this.users = data.users;
        // this.avatarSrc =

        editGroup.getData(data);
    }

    getHTML() {
        Handlebars.registerHelper("eq", (a, b) => a == b);

        const data = {
            // avatarSrc: this.avatarSrc,
            title: this.title,
            members: this.users,
            membersCount: this.countUsers,
        };

        const groupInfoTemplate = Handlebars.templates["GroupInfo.hbs"];
        const html = groupInfoTemplate({ ...data });

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
        buttonEdit.addEventListener("click", (event) => {
            event.preventDefault();

            console.log("go to edit group");
        });
    }
}

export const groupInfo = new GroupInfo();
