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
        return this.api.post("/login/", {
            username,
            password,
        });
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
        return this.api.post("/register/", {
            username,
            phone,
            password,
            confirm_password,
        });
    }

    async logout() {
        return this.api.delete("/logout/");
    }
}

export const auth = new Auth();
