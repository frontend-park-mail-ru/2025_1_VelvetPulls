import { eventBus } from "../../../shared/modules/EventBus/EventBus.js";

class Profile {
    getData() {
        this.data = {
            firstName: "Михал",
            lastName: "Палыч",
            onlineStatus: "В сети",
            avatarUrl: "img/Avatar.png",
            phone: "+7 777 777-77-77",
            username: "moneyman",
            bio: "23 года, дизайнер из Санкт-Петербурга",
        };
    }

    getHTML() {
        this.getData();

        const profileTemplate = Handlebars.templates["Profile.hbs"];
        const html = profileTemplate({ ...this.data });

        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");

        const container = doc.body.firstChild;
        this.container = container;

        this.container = container;
        this.addListeners();

        return container;
    }

    addListeners() {
        // Назад (к чатам)
        const backButton = this.container.querySelector("#button-back");
        backButton.addEventListener("click", (event) => {
            event.preventDefault();
            console.log("here");
            eventBus.emit("profile -> chats");
        });

        // Изменить профиль
        const editButton = this.container.querySelector("#button-edit");
        editButton.addEventListener("click", (event) => {
            event.preventDefault();
            eventBus.emit("profile -> edit profile");
        });

        // Выйти из аккаунта
        const logoutButton = this.container.querySelector("#button-logout");
        logoutButton.addEventListener("click", (event) => {
            event.preventDefault();
            eventBus.emit("profile -> logout");
        });
    }
}

export const profile = new Profile();
