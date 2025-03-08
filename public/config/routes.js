import { renderLogin } from "../pages/login/login.js";
import { renderChats } from "../pages/chats/chats.js";
import { renderSignup } from "../pages/signup/signup.js";

const authData = {
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

renderAuthForm(registerData);

export const config = {
    'signup': {
        href: '/signup',
        title: 'Регистрация',
        render: renderSignup,
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
