import { renderLogin } from "../pages/login/login.js";
import { renderChats } from "../pages/chats/chats.js";
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
    'chats': {
        href: '/chats',
        title: 'Keftegram',
        render: renderChats,
    },
}
