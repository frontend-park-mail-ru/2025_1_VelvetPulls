import { ListOfChats } from "../ListOfChats/ListOfChats.js";
import { ProfileApi } from "./api/profile.js";
import { goToPage } from "../../shared/helpers/goToPage.js";
import { API_URI } from "../../shared/api/api.js";
import { auth } from "../../shared/api/auth.js";

export class Profile {
    constructor() {
        this.popupState = false;
        this.isEditMode = false;
        this.profileApi = new ProfileApi();
        this.data = {};
        this.original_avatar_url = null;
    }

    async getData() {
        try {
            const response = await this.profileApi.getProfile();

            if (response.status === false) {
                return {
                    ok: false,
                    error: response.error,
                };
            }

            this.data = response.data;
            if (this.data.avatar_path) {
                this.data.avatar_url = this.getFullAvatarUrl(
                    this.data.avatar_path,
                );
            }

            return {
                ok: true,
                error: "",
            };
        } catch (error) {
            console.error("Profile loading error:", error);
            return {
                ok: false,
                error: "Ошибка загрузки профиля",
            };
        }
    }

    getFullAvatarUrl(relativePath) {
        const cleanPath = relativePath.startsWith(".")
            ? relativePath.substring(1)
            : relativePath;
        return `${API_URI}${cleanPath}`;
    }

    getHTML() {
        const template = Handlebars.templates["Profile.hbs"];
        return template({
            ...this.data,
            isEditMode: this.isEditMode,
        });
    }

    addListeners(mainPage) {
        // Кнопка назад
        document
            .getElementsByName("back")[0]
            ?.addEventListener("click", (event) => {
                event.preventDefault();
                mainPage.sidebar = new ListOfChats();
                mainPage.render();
            });

        // Кнопка редактирования
        document
            .querySelector(".header__action-btn[aria-label='Edit']")
            ?.addEventListener("click", () => {
                this.toggleEditMode(mainPage);
            });

        // Кнопка удаления профиля
        document
            .querySelector(".header__action-btn[aria-label='Options']")
            ?.addEventListener("click", () => {
                this.showDeleteConfirmation(mainPage);
            });

        // Если в режиме редактирования - добавляем обработчики формы
        if (this.isEditMode) {
            this.addEditFormListeners(mainPage);
        }
    }

    toggleEditMode(mainPage) {
        this.isEditMode = !this.isEditMode;
        mainPage.render();
    }

    async saveProfile(mainPage) {
        const profileData = {
            first_name: document.getElementById("firstName").value,
            last_name: document.getElementById("lastName").value,
            phone: document.getElementById("phone").value,
            username: document.getElementById("username").value,
            email: document.getElementById("email").value,
        };

        const avatarInput = document.getElementById("avatarUpload");
        const avatarFile =
            avatarInput.files.length > 0 ? avatarInput.files[0] : null;

        try {
            document.body.classList.add("uploading");

            const response = await this.profileApi.updateProfile(
                profileData,
                avatarFile,
            );

            if (response.status === false) {
                throw new Error(response.error || "Unknown error");
            }

            this.data = response.data;
            this.isEditMode = false;
            mainPage.render();
        } catch (error) {
            console.error("Profile update error:", error);
            alert(`Ошибка при сохранении профиля: ${error.message}`);
        } finally {
            document.body.classList.remove("uploading");
        }
    }

    async handleAvatarUpload(event, mainPage) {
        const file = event.target.files[0];
        if (!file) return;

        const previewUrl = URL.createObjectURL(file);
        this.data.avatar_url = previewUrl;
        mainPage.render();

        try {
            const response = await this.profileApi.updateProfile(null, file);

            if (response.status === false) {
                throw new Error(response.error || "Ошибка обновления аватара");
            }

            if (response.data.avatar_path) {
                this.data.avatar_url = this.getFullAvatarUrl(
                    response.data.avatar_path,
                );
            }

            mainPage.render();
        } catch (error) {
            console.error("Avatar upload error:", error);
            alert(error.message);
            if (this.data.original_avatar_url) {
                this.data.avatar_url = this.data.original_avatar_url;
            }
            mainPage.render();
        } finally {
            URL.revokeObjectURL(previewUrl);
        }
    }

    showDeleteConfirmation(mainPage) {
        if (
            confirm(
                "Вы уверены, что хотите удалить профиль? Это действие нельзя отменить.",
            )
        ) {
            this.deleteProfile(mainPage);
        }
    }

    async deleteProfile() {
        try {
            const response = await this.profileApi.deleteProfile();

            if (response.status === false) {
                alert("Ошибка удаления: " + response.error);
                return;
            }

            alert("Профиль успешно удален");
            auth.logout();
            goToPage("login");
        } catch (error) {
            console.error("Profile deletion error:", error);
            alert("Ошибка при удалении профиля");
        }
    }

    addEditFormListeners(mainPage) {
        document
            .getElementById("profileForm")
            ?.addEventListener("submit", (e) => {
                e.preventDefault();
                this.saveProfile(mainPage);
            });

        // Отмена редактирования
        document.getElementById("cancelEdit")?.addEventListener("click", () => {
            this.isEditMode = false;
            mainPage.render();
        });

        // Загрузка аватара
        document
            .getElementById("avatarUpload")
            ?.addEventListener("change", (e) => {
                this.handleAvatarUpload(e, mainPage);
            });
    }
}
