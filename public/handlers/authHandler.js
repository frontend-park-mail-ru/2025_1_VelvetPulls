import { Auth } from "../modules/auth.js";
import { goToPage } from "../modules/router.js";

export const authHandler = {
    /**
     * Обрабатывает процесс авторизации пользователя.
     *
     * @async
     * @function handleLogin
     * @param {string} username - Имя пользователя или email для авторизации.
     * @param {string} password - Пароль пользователя.
     * @returns {Promise<void>} - Промис, который завершается после выполнения авторизации.
     * @throws {Error} - Если авторизация не удалась, выводит сообщение об ошибке.
     *
     */
    handleLogin: async (username, password) => {
        const isLoggedIn = await Auth.login(username, password);
        //console.log(isLoggedIn);
        if (isLoggedIn) {
            goToPage("chats");
        } else {
            alert("Ошибка авторизации. Проверьте email и пароль.");
        }
    },
    /**
     * Обрабатывает процесс регистрации нового пользователя.
     *
     * @async
     * @function handleRegister
     * @param {string} username - Имя пользователя для регистрации.
     * @param {string} phone - Номер телефона пользователя.
     * @param {string} password - Пароль пользователя.
     * @param {string} repeatPassword - Повторный ввод пароля для подтверждения.
     * @returns {Promise<void>} - Промис, который завершается после выполнения регистрации.
     * @throws {Error} - Если регистрация не удалась, выводит сообщение об ошибке.
     *
     */
    handleRegister: async (username, phone, password, repeatPassword) => {
        const isRegistered = await Auth.register(
            username,
            phone,
            password,
            repeatPassword,
        );
        //console.log(isRegistered)
        if (isRegistered) {
            goToPage("chats");
        } else {
            alert("Ошибка регистрации. Возможно, пользователь уже существует.");
        }
    },

    handleLogout: () => {
        Auth.logout();
        goToPage("login");
    },

    redirectToLogin: () => {
        goToPage("login");
    },

    redirectToSignup: () => {
        goToPage("signup");
    },
};
