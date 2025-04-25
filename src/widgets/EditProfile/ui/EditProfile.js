import { eventBus } from "../../../shared/modules/EventBus/EventBus.js";
import { store } from "../../../app/store/index.js";

class EditProfile {
    getHTML() {
        const data = store.profile;

        const editProfileTemplate = Handlebars.templates["EditProfile.hbs"];
        const html = editProfileTemplate({ ...data });

        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");

        const fileInput1 = doc.querySelector("#fileInput1");
        const avatarContainer = doc.querySelector(".avatar-container-upload");
        const avatarImage = doc.getElementById("avatarImage");

        avatarContainer.addEventListener("click", function () {
            fileInput1.click(); // Открываем диалог выбора файла
        });

        fileInput1.addEventListener("change", function (event) {
            const file = event.target.files[0];
            this.avatar = file;
            if (file) {
                const reader = new FileReader();

                reader.onload = function (e) {
                    avatarImage.src = e.target.result; // Устанавливаем выбранное фото
                };

                reader.readAsDataURL(file); // Читаем файл как Data URL
            }
        });

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

    isEqualPasswords(input1, input2) {
        return input1 === input2;
    }

    createError(input, text) {
        const parent = input.parentNode;
        parent.classList.add("auth-form__error");

        const errorLabel = document.createElement("label");
        errorLabel.classList.add("error-label");
        errorLabel.textContent = text;

        parent.append(errorLabel);
    }

    removeError(input) {
        const parent = input.parentNode;

        if (parent.classList.contains("auth-form__error")) {
            parent.querySelector(".error-label").remove();
            parent.classList.remove("auth-form__error");
        }
    }

    async updateUser() {
        const avaImg = this.container.querySelector("#fileInput1");
        // let avatarFile =
        //     avatarInput.files.length > 0 ? avatarInput.files[0] : null;
        const avatarFile = avaImg.files.length > 0 ? avaImg.files[0] : null;
        console.log(avatarFile);

        const firstNameInput =
            this.container.querySelector("#first-name-input");
        const firstName = firstNameInput.value;

        const lastNameInput = this.container.querySelector("#last-name-input");
        const lastName = lastNameInput.value;

        const emailInput = this.container.querySelector("#email-input");
        const email = emailInput.value;

        const usernameInput = this.container.querySelector("#username-input");
        const username = usernameInput.value;

        const newPasswordInput = this.container.querySelector(
            "#new-password-input",
        );
        const newPassword = newPasswordInput.value;

        const repeatPasswordInput = this.container.querySelector(
            "#repeat-password-input",
        );
        const repeatPassword = repeatPasswordInput.value;
        if (
            this.isEqualPasswords(newPassword, repeatPassword) &&
            newPassword != null
        ) {
            const profileData = {
                first_name: firstName,
                last_name: lastName,
                email: email,
                username: username,
                password: newPassword,
                phone: store.profile.phone,
            };
            const formData = new FormData();

            if (avatarFile !== null) {
                formData.append("avatar", avatarFile);
            }

            formData.append("profile_data", JSON.stringify(profileData));

            eventBus.emit("profile: update", formData);
        } else if (newPassword != null) {
            this.removeError(repeatPasswordInput);
            this.createError(
                repeatPasswordInput,
                "Новый пароль не подтвержден!",
            );
        } else {
            const profileData = {
                first_name: firstName,
                last_name: lastName,
                email: email,
                username: username,
                phone: store.profile.phone,
            };

            const formData = new FormData();

            if (avatarFile !== null) {
                formData.append("avatar", avatarFile);
            }

            formData.append("profile_data", JSON.stringify(profileData));

            eventBus.emit("profile: update", formData);
        }
    }
}

export const editProfile = new EditProfile();
