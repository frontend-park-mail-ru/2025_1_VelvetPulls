import { renderLogin } from "../pages/login/login.js";
import { renderChats } from "../pages/chats/chats.js";
import { renderSignup } from "../pages/signup/signup.js";

const authData = {
    fields: [
        {
            type: "email",
            id: "email",
            name: "email",
            placeholder: "Введите email"
        },
        {
            type: "password",
            id: "password",
            name: "password",
            placeholder: "Введите пароль"
        }
    ],
    buttonText: "Войти",
    redirectText: "Нет аккаунта? Зарегистрируйтесь"
};

export const config = {
    'signup': {
        href: '/signup',
        title: 'Регистрация',
        render: renderSignup,
    },
    'login': {
        href: '/login',
        title: 'Авторизация',
        render: renderLogin(authData),
    },
    'chats': {
        href: '/chats',
        title: 'Keftegram',
        render: renderChats,
    },
}
