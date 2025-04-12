import { api } from "../../../shared/api/api.js";

import { eventBus } from "../../../shared/modules/EventBus/EventBus.js";
import { currentUser } from "../../../entities/User/model/User.js";

class EditProfile {
    getHTML() {
        const data = {
            username: currentUser.getUsername(),
            fullName: currentUser.getFullName(),
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
        console.log("avatar input:", avatarInput);
        const avatarFile =
            avatarInput.files.length > 0 ? avatarInput.files[0] : null;
        console.log("avatar:", avatarFile);

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
        console.log("update to data:", profileData);

        const formData = new FormData();

        if (avatarFile !== null) {
            formData.append("avatar", avatarFile);
        }

        console.log("stringify:", JSON.stringify(profileData));

        formData.append("profile_data", JSON.stringify(profileData));

        const request = {
            method: "PUT",
            headers: {},
            mode: "cors",
            credentials: "include",
            body: formData,
        };

        // const response = await fetch(
        //     "http://localhost:8080/api/profile",
        //     request,
        // );

        // const response = await api.put("/profile", formData);
        // console.log("response:", response);

        currentUser.update(formData);

        // const responseBody = await response.json();
        // console.log("response body:", responseBody);

        eventBus.emit("edit profile -> save");
    }
}

export const editProfile = new EditProfile();
