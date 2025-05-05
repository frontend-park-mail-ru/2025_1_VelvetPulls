import { eventBus } from "../../../shared/modules/EventBus/EventBus.js";
import { api } from "../../../shared/api/api.js";

class CreateDialog {
    getHTML() {
        const createGroupTemplate = Handlebars.templates["CreateDialog.hbs"];
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
            eventBus.emit("new chat is created");
        });

        // Далее (добавить участников)
        const nextButton = this.container.querySelector(
            ".sidebar__fixed-button",
        );
        nextButton.addEventListener("click", async (event) => {
            event.preventDefault();

            const input = this.container.querySelector("#username-input");

            if (input.value === "") {
                this.createErrorIfNotExists("username не может быть пустым");
            } else {
                let username = input.value.trim();

                if (username !== null) {
                    const responseBody = await api.get(`/profile/${username}`);

                    if (responseBody.status === true) {
                        eventBus.emit("create dialog", username);

                        // const chatData = {
                        //     type: "dialog",
                        //     dialog_user: username,
                        //     title: "1",
                        // };
                        // await createChat(chatData);

                        // chatWebSocket.reconnect();

                        // eventBus.emit("new chat is created");
                    } else {
                        this.createErrorIfNotExists(
                            `Пользователь с username "${username}" не найден`,
                        );
                    }
                }
                ///eventBus.emit("new dialog",username)
                //eventBus.emit("new dialog -> chats");
            }
        });

        const usernameInput = this.container.querySelector("#username-input");
        usernameInput.addEventListener(
            "input",
            this.removeErrorIfExists.bind(this),
        );
    }

    createErrorIfNotExists(textError) {
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

export const createDialog = new CreateDialog();
