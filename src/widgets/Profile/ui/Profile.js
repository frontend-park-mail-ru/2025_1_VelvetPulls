import { eventBus } from "../../../shared/modules/EventBus/EventBus.js";
import { currentUser } from "../../../entities/User/model/User.js";

class Profile {
    getHTML() {
        const data = {
            username: currentUser.getUsername(),
            fullName: currentUser.getFullName(),
            phone: currentUser.getPhone(),
            avatarPath: currentUser.avatarSrc,
        };

        console.log("profile data:", data);

        const profileTemplate = Handlebars.templates["Profile.hbs"];
        const html = profileTemplate({ ...data });

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
