import { renderLogin } from "../pages/login/login.js";
import { renderChats } from "../pages/chats/chats.js";
import { renderSignup } from "../pages/signup/signup.js";

export const authData = {
    fields: [
        {
            type: "text",
            id: "username",
            name: "username",
            placeholder: "Имя пользователя/Телефон/Почта"
        },
        {
            type: "password",
            id: "password",
            name: "password",
            placeholder: "Пароль"
        }
    ],
    buttonText: "Войти",
    redirectText: "Создать"
};

const registerData = {
    fields: [
        {
            type: "text",
            id: "username",
            name: "username",
            placeholder: "Имя пользователя"
        },
        {
            type: "tel",
            id: "phone",
            name: "phone",
            placeholder: "Телефон (123-456-67-89)"
        },
        {
            type: "password",
            id: "password",
            name: "password",
            placeholder: "Пароль"
        },
        {
            type: "password",
            id: "confirm-password",
            name: "confirm-password",
            placeholder: "Подтвердите пароль"
        }
    ],
    buttonText: "Зарегистрироваться",
    redirectText: "Войдите"
};

const chatsData = {
    chats: [
        {
            avatar: "https://example.com/avatar1.jpg",
            name: "Floyd Miles",
            preview: "Then make a deal",
            time: "12:00",
            unreadCount: 0,
            active: false
        },
        {
            avatar: "https://example.com/avatar2.jpg",
            name: "Albert Flores",
            preview: "Okay...Do we have a deal?",
            time: "12:00",
            unreadCount: 70,
            active: true
        },
    ]
};

export const config = {
    'signup': {
        href: '/signup',
        title: 'Регистрация',
        render: renderSignup(registerData),
        // render: document.createElement("div"),
    },
    'login': {
        href: '/login',
        title: 'Авторизация',
        render: renderLogin(authData),
        // render: document.createElement("div"),
    },
    'chats': {
        href: '/chats',
        title: 'Keftegram',
        render: renderChats(chatsData),
        // render: document.createElement("div"),
    },
}
