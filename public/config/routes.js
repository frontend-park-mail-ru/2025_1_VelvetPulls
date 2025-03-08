import { renderLogin } from "../pages/login/login.js";

export const config = {
    'signup': {
        href: '/signup',
        title: 'Регистрация',
        render: renderLogin,
    },
    'login': {
        href: '/login',
        title: 'Авторизация',
        render: renderLogin,
    },
}