import { auth } from "../modules/auth.js";
import { goToPage } from '../modules/router.js';

export const authHandler = {
    handleLogin: async (username, password) => {
        const isLoggedIn = await auth.login(username, password);
        if (isLoggedIn) {
            goToPage('chats');
        } else {
            alert('Ошибка авторизации. Проверьте email и пароль.');
        }
    },

    handleRegister: async (username, phone, password, repeatPassword) => {
        const isRegistered = await auth.register(username, phone, password, repeatPassword);
        if (isRegistered) {
            goToPage('chats');
        } else {
            alert('Ошибка регистрации. Возможно, пользователь уже существует.');
        }
    },

    handleLogout: () => {
        auth.logout();
        goToPage('login');
    },


    redirectToLogin: () => {
        goToPage('login');
    },


    redirectToSignup: () => {
        goToPage('signup');
    }
};
