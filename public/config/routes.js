import { renderLogin } from "../pages/login/login.js";
import { renderChats } from "../pages/chats/chats.js";
import { renderSignup } from "../pages/signup/signup.js";

export const authData = {
    fields: [
        {
            type: "text",
            id: "username",
            name: "username",
            placeholder: "Имя пользователя/Телефон/Почта",
        },
        {
            type: "password",
            id: "password",
            name: "password",
            placeholder: "Пароль",
        },
    ],
    buttonText: "Войти",
    redirectText: "Создать",
};

const registerData = {
    fields: [
        {
            type: "text",
            id: "username",
            name: "username",
            placeholder: "Имя пользователя",
        },
        {
            type: "tel",
            id: "phone",
            name: "phone",
            placeholder: "Телефон",
        },
        {
            type: "password",
            id: "password",
            name: "password",
            placeholder: "Пароль",
        },
        {
            type: "password",
            id: "confirm-password",
            name: "confirm-password",
            placeholder: "Подтвердите пароль",
        },
    ],
    buttonText: "Создать аккаунт",
    redirectText: "Войдите",
};

const chatsData = {
    chats: [
        {
            title: "Keftegr@m",
            description: "чат с Keftegram",
            unreadCount: 1,
        },
    ],
};

// export const config = {
//     'signup': {
//         href: '/signup',
//         title: 'Регистрация',
//         render: renderSignup(registerData),
//         // render: document.createElement("div"),
//     },
//     'login': {
//         href: '/login',
//         title: 'Авторизация',
//         render: renderLogin(authData),
//         // render: document.createElement("div"),
//     },
//     'chats': {
//         href: '/chats',
//         title: 'Keftegram',
//         render: renderChats(chatsData),
//         // render: document.createElement("div"),
//     },
// }

export const config = {
    signup: {
        href: "/signup",
        title: "Регистрация",
        render: {
            func: renderSignup,
            data: registerData,
        },
    },
    login: {
        href: "/login",
        title: "Авторизация",
        render: {
            func: renderLogin,
            data: authData,
        },
    },
    chats: {
        href: "/chats",
        title: "Keftegram",
        render: {
            func: renderChats,
            data: chatsData,
        },
    },
};
