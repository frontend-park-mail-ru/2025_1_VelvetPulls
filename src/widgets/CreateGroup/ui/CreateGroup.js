import { eventBus } from "../../../shared/modules/EventBus/EventBus.js";

class CreateGroup {
    getHTML() {
        const createGroupTemplate = Handlebars.templates["CreateGroup.hbs"];
        const html = createGroupTemplate({});

        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");

        const container = doc.body.firstChild;
        this.container = container;

        this.container = container;
        this.addListeners();

        return container;
    }

    addListeners() {
        // Назад (в чаты)
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
            eventBus.emit("new group -> add members");
        });
    }
}

export const createGroup = new CreateGroup();
