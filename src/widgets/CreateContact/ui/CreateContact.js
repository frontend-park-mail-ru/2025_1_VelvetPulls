import { eventBus } from "../../../shared/modules/EventBus/EventBus.js";
import { api } from "../../../shared/api/api.js";

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
        nextButton.addEventListener("click", async (event) => {
            event.preventDefault();

            // alert(
            //     "Здесь будет выполняться сохранение контакта (со всеми необходимыми проверками)",
            // );

            const input = this.container.querySelector("#username-input");
            const requestBody = {
                username: input.value,
            };

            const response = await api.post("/contacts", requestBody);

            if (response.status === false) {
                alert(`Пользователь ${input.value} не найден`);
            }

            eventBus.emit("new contact -> chats");
        });
    }
}

export const createContact = new CreateContact();
