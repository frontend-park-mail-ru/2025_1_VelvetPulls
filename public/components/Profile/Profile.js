import { ListOfChats } from "../ListOfChats/ListOfChats.js";
import { ProfileApi } from "../../modules/profile.js";
import { goToPage } from "../../modules/router.js";

export class Profile {
    constructor() {
        this.popupState = false;
        this.isEditMode = false;
        this.profileApi = new ProfileApi();
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

    getHTML() {
        const template = Handlebars.templates["Profile.hbs"];
        return template({ 
            ...this.data,
            isEditMode: this.isEditMode
        });
    }

    addListeners(mainPage) {
        // Кнопка назад
        document.getElementsByName("back")[0]?.addEventListener("click", (event) => {
            event.preventDefault();
            mainPage.sidebar = new ListOfChats();
            mainPage.render();
        });

        // Кнопка редактирования
        document.querySelector(".header__action-btn[aria-label='Edit']")?.addEventListener("click", () => {
            this.toggleEditMode(mainPage);
        });

        // Кнопка удаления профиля
        document.querySelector(".header__action-btn[aria-label='Options']")?.addEventListener("click", () => {
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
        const formData = {
            first_name: document.getElementById("firstName").value,
            last_name: document.getElementById("lastName").value,
            phone: document.getElementById("phone").value,
            username: document.getElementById("username").value,
            //birthday: document.getElementById("birthday").value
        };

        try {
            const response = await this.profileApi.updateProfile(formData);
            
            if (response.status === false) {
                alert("Ошибка обновления: " + response.error);
                return;
            }

            this.data = response.data;
            this.isEditMode = false;
            mainPage.render();
            
        } catch (error) {
            console.error("Profile update error:", error);
            alert("Ошибка при сохранении профиля");
        }
    }

    async handleAvatarUpload(event, mainPage) {
        const file = event.target.files[0];
        if (!file) return;

        try {
            const response = await this.profileApi.uploadAvatar(file);
            
            if (response.status === false) {
                alert("Ошибка загрузки аватара: " + response.error);
                return;
            }

            this.data.avatar_path = response.data.avatar_path;
            mainPage.render();
            
        } catch (error) {
            console.error("Avatar upload error:", error);
            alert("Ошибка при загрузке аватара");
        }
    }

    showDeleteConfirmation(mainPage) {
        if (confirm("Вы уверены, что хотите удалить профиль? Это действие нельзя отменить.")) {
            this.deleteProfile(mainPage);
        }
    }

    async deleteProfile(mainPage) {
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
        // Сохранение формы
        document.getElementById("profileForm")?.addEventListener("submit", (e) => {
            e.preventDefault();
            this.saveProfile(mainPage);
        });

        // Отмена редактирования
        document.getElementById("cancelEdit")?.addEventListener("click", () => {
            this.isEditMode = false;
            mainPage.render();
        });

        // Загрузка аватара
        document.getElementById("avatarUpload")?.addEventListener("change", (e) => {
            this.handleAvatarUpload(e, mainPage);
        });
    }
}