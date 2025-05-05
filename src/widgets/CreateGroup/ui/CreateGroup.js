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

            const input = this.container.querySelector("#group-title-input");

            if (input.value === "") {
                this.createError("Название группы не может быть пустым");
            } else {
                const groupInfo = {
                    title: input.value,
                };

                eventBus.emit("new group -> add members", groupInfo);
            }
        });

        const titleInput = this.container.querySelector("#group-title-input");
        titleInput.addEventListener(
            "input",
            this.removeErrorIfExists.bind(this),
        );
    }

    createError(textError) {
        const errorElement = document.createElement("div");
        errorElement.innerHTML = textError;
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

export const createGroup = new CreateGroup();
