import {
    phoneInputListener,
    signupFormSubmitListener,
    togglePasswordListener,
    usernameInputListener,
    passwordInputListener,
    repeatPasswordInputListener,
} from "../../shared/helpers/eventListeners.js";
import { toLogin } from "./eventListeners.js";
import { RenderResult } from "../../entities/RenderResponse.js";
import { AuthForm } from "../../widgets/AuthForm/AuthForm.js";

class SignupPage {
    constructor() {
        this.fields = [
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
                placeholder: "Номер телефона",
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
        ];
        this.submitButtonText = "Создать аккаунт";
    }

    addListeners() {
        // Валидация полей формы
        const phoneInput = this.container.querySelector("#phone");
        phoneInput.addEventListener("input", phoneInputListener);

        const username = this.container.querySelector("#username");
        username.addEventListener("input", usernameInputListener);

        const password = this.container.querySelector("#password");
        password.addEventListener("input", passwordInputListener);

        const repeatPassword =
            this.container.querySelector("#confirm-password");
        repeatPassword.addEventListener("input", repeatPasswordInputListener);

        // Отправить форму
        const signupForm = this.container.querySelector(".auth-form");
        signupForm.addEventListener("submit", signupFormSubmitListener);

        // Переключить видимость пароля
        const togglers = this.container.querySelectorAll(
            ".auth-form__toggle-password",
        );
        for (const toggler of togglers) {
            toggler.addEventListener("click", (event) => {
                togglePasswordListener(event, toggler);
            });
        }

        // Перейти на страницу авторизации
        const loginLink = this.container.querySelector("#loginLink");
        loginLink.addEventListener("click", toLogin);
    }

    render() {
        const signupPageTemplate = Handlebars.templates["SignupPage.hbs"];
        const html = signupPageTemplate({});

        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");
        const container = doc.body.firstChild;
        this.container = container;

        const fields = this.fields;
        const submitButtonText = this.submitButtonText;

        const signupForm = new AuthForm(fields, submitButtonText);
        const signupFormDomElement = signupForm.render();

        const logo = container.querySelector("#main-auth__logo");
        logo.after(signupFormDomElement);

        this.addListeners();

        const root = document.getElementById("root");
        root.innerHTML = "";
        root.appendChild(container);

        return new RenderResult({});
    }
}

export const signupPage = new SignupPage();
