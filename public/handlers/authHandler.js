import { Auth } from "../modules/auth.js";
import { goToPage } from '../modules/router.js';

export const authHandler = {
    handleLogin: async (username, password) => {
        const isLoggedIn = await Auth.login(username, password);
        if (isLoggedIn) {
            goToPage('chats');
        } else {
            alert('Ошибка авторизации. Проверьте email и пароль.');
        }
    },

    handleRegister: async (username, phone, password, repeatPassword) => {
        const isRegistered = await Auth.register(username, phone, password, repeatPassword);
        if (isRegistered) {
            goToPage('chats');
        } else {
            alert('Ошибка регистрации. Возможно, пользователь уже существует.');
        }
    },

    handleLogout: () => {
        Auth.logout();
        goToPage('login');
    },


    redirectToLogin: () => {
        goToPage('login');
    },


    redirectToSignup: () => {
        goToPage('signup');
    }
};
