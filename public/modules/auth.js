import { api } from "./api.js";

export class Auth {
    constructor() {
        this.api = api;
    }

    /**
     * Авторизация пользователя
     * @param {string} username
     * @param {string} password
     * @returns {boolean} Получение ответа от сервера
     */
    async login(username, password) {
        try {
            const response = await this.api.post("/login/", {
                username,
                password,
            });
            console.log(response);
            if (response.status === true) {
                // localStorage.setItem("token", response.token);
                return true;
            } else {
                throw new Error(response.message || "Login failed");
            }
        } catch (error) {
            console.error("Login error:", error);
            return false;
        }
    }

    /**
     * Регистрация пользователя
     * @param {string} username
     * @param {string} phone
     * @param {string} password
     * @param {string} repeatPassword
     * @returns {boolean} Получение ответа от сервера
     */
    async register(username, phone, password, confirm_password) {
        try {
            const response = await this.api.post("/register/", {
                username,
                phone,
                password,
                confirm_password,
            });
            console.log(response);
            if (response.status === true) {
                return true;
            } else {
                throw new Error(response.message || "Registration failed");
            }
        } catch (error) {
            console.error("Registration error:", error);
            return false;
        }
    }

    async logout() {
        return this.api.delete("/logout/");
    }
}

export const auth = new Auth();
