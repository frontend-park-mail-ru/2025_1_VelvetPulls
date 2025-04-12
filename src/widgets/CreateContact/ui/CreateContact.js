import { eventBus } from "../../../shared/modules/EventBus/EventBus.js";

class CreateContact {
    getHTML() {
        const createGroupTemplate = Handlebars.templates["CreateContact.hbs"];
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
            eventBus.emit("new contact -> chats");
        });

        // Далее (создать контакт)
        const nextButton = this.container.querySelector(
            ".sidebar__fixed-button",
        );
        nextButton.addEventListener("click", (event) => {
            event.preventDefault();
            alert(
                "Здесь будет выполняться сохранение контакта (со всеми необходимыми проверками)",
            );
            // eventBus.emit("new contact -> save");
            eventBus.emit("new contact -> chats");
        });
    }
}

export const createContact = new CreateContact();
