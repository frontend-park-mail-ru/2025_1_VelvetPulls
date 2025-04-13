import { chatsapi } from "../../../shared/api/chats.js";
import { eventBus } from "../../../shared/modules/EventBus/EventBus.js";
import { currentUser } from "../../../entities/User/model/User.js";
class CreateGroup {
    getHTML() {
        const createGroupTemplate = Handlebars.templates["CreateGroup.hbs"];
        const html = createGroupTemplate({});

        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");

        const container = doc.body.firstChild;
        this.container = container;

        this.createGroup=doc.querySelector(".create-group")
        this.addListeners();

        return container;
    }

    addListeners() {
        // Назад (в чаты)
        const name_con = this.createGroup.querySelector("#group_name");
        name_con.addEventListener("input", (event) => {
            event.preventDefault();
            this.group_name=event.target.value
        });

        const extra_con = this.createGroup.querySelector("#extra_info");
        extra_con.addEventListener("input", (event) => {
            event.preventDefault();
            this.extra_info=event.target.value
        });

        const backButton = this.container.querySelector("#button-back");
        backButton.addEventListener("click", (event) => {
            event.preventDefault();
            eventBus.emit("new group -> chats");
        });

        // Далее (добавить участников)
        const nextButton = this.container.querySelector(
            ".sidebar__fixed-button",
        );
        nextButton.addEventListener("click", (event) => {
            event.preventDefault();
            chatsapi.addgroup(this.group_name,currentUser.getUsername())
            eventBus.emit("new group -> add members");
        });
    }
}

export const createGroup = new CreateGroup();
