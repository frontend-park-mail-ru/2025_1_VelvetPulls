import { API } from "./api.js";

export class auth {
    constructor() {
        this.API = API;
    }
    /**
     * Авторизация пользователя
     * @param {string} username
     * @param {string} password
     * @returns {boolean} Получение ответа от сервера
     */
    async login(username, password) {
        try {
            const response = await this.API.post("/login/", {
                username,
                password,
            });
            //console.log(response.status);
            if (response.status === true) {
                localStorage.setItem("token", response.token);
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
            const response = await this.API.post("/register/", {
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

    logout() {
        localStorage.removeItem("token");
    }
}

export const Auth = new auth();
