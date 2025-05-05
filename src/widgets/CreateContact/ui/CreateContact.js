import { eventBus } from "../../../shared/modules/EventBus/EventBus.js";

class CreateContact {
    constructor() {
        eventBus.on(
            "store: contact not found",
            this.onContactNotFound.bind(this),
        );
    }

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
        nextButton.addEventListener("click", async (event) => {
            event.preventDefault();

            const input = this.container.querySelector("#username-input");
            const username = input.value.trim();
            eventBus.emit("contacts: create", username);
        });

        const usernameInput = this.container.querySelector("#username-input");
        usernameInput.addEventListener(
            "input",
            this.removeErrorIfExists.bind(this),
        );
    }

    onContactNotFound(username) {
        const errorElement = document.createElement("div");
        errorElement.innerHTML = `Пользователь ${username} не найден`;
        errorElement.classList.add("error-label");

        const container = this.container;
        const sidebarList = container.querySelector(".sidebar-list");
        const lastElementChild = sidebarList.lastElementChild;

        if (!lastElementChild.classList.contains("error-label")) {
            sidebarList.appendChild(errorElement);
        }
    }

    removeErrorIfExists() {
        const container = this.container;
        const sidebarList = container.querySelector(".sidebar-list");
        const lastElementChild = sidebarList.lastElementChild;

        if (
            lastElementChild.classList !== undefined &&
            lastElementChild.classList.contains("error-label")
        ) {
            sidebarList.removeChild(lastElementChild);
        }
    }
}

export const createContact = new CreateContact();
