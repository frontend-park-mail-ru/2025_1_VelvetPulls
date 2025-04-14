// import { api } from "../../../shared/api/api.js";

import { eventBus } from "../../../shared/modules/EventBus/EventBus.js";
import { currentUser } from "../../../entities/User/model/User.js";

class EditProfile {
    getHTML() {
        const data = {
            firstName: currentUser.getFirstName(),
            lastName: currentUser.getLastName(),
            username: currentUser.getUsername(),
        };

        const editProfileTemplate = Handlebars.templates["EditProfile.hbs"];
        const html = editProfileTemplate({ ...data });

        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");

        const container = doc.body.firstChild;
        this.container = container;

        this.container = container;
        this.addListeners();

        return container;
    }

    addListeners() {
        // Назад (в профиль)
        const backButton = this.container.querySelector("#button-back");
        backButton.addEventListener("click", (event) => {
            event.preventDefault();
            eventBus.emit("edit profile -> back");
        });

        // Сохранить изменения
        const saveButton = this.container.querySelector("#button-save");
        saveButton.addEventListener("click", async (event) => {
            event.preventDefault();
            this.updateUser();
        });
    }

    async updateUser() {
        const avatarInput = this.container.querySelector("#avatar-input");
        const avatarFile =
            avatarInput.files.length > 0 ? avatarInput.files[0] : null;

        const firstNameInput =
            this.container.querySelector("#first-name-input");
        const firstName = firstNameInput.value;

        const lastNameInput = this.container.querySelector("#last-name-input");
        const lastName = lastNameInput.value;

        const usernameInput = this.container.querySelector("#username-input");
        const username = usernameInput.value;

        const profileData = {
            first_name: firstName,
            last_name: lastName,
            username: username,
            phone: currentUser.getPhone(),
        };

        const formData = new FormData();

        if (avatarFile !== null) {
            formData.append("avatar", avatarFile);
        }

        formData.append("profile_data", JSON.stringify(profileData));

        currentUser.update(formData);

        eventBus.emit("edit profile -> save");
    }
}

export const editProfile = new EditProfile();
