import {
    phoneInputListener,
    signupFormSubmitListener,
    togglePasswordListener,
    usernameInputListener,
    passwordInputListener,
    repeatPasswordInputListener,
} from "../../shared/helpers/eventListeners.js";
import { toLogin } from "./eventListeners.js";
import { RenderResult } from "../../shared/modules/RenderResponse.js";
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
        const phoneInput = this.container.querySelector("#phone");
        phoneInput.addEventListener("input", phoneInputListener);

        const username = this.container.querySelector("#username");
        username.addEventListener("input", usernameInputListener);

        const password = this.container.querySelector("#password");
        password.addEventListener("input", passwordInputListener);

        const repeatPassword =
            this.container.querySelector("#confirm-password");
        repeatPassword.addEventListener("input", repeatPasswordInputListener);

        const signupForm = this.container.querySelector(".auth-form");
        signupForm.addEventListener("submit", signupFormSubmitListener);

        const togglers = this.container.querySelectorAll(
            "auth-form__toggle-password",
        );
        for (const toggler of togglers) {
            toggler.addEventListener("click", (event) => {
                togglePasswordListener(event, toggler);
            });
        }

        // ------------------

        const loginLink = this.container.querySelector("#loginLink");
        console.log("link", loginLink);
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

        console.log("signup form", signupFormDomElement);
        console.log("container", container);

        const logo = container.querySelector("#main-auth__logo");
        logo.after(signupFormDomElement);

        this.addListeners();

        return new RenderResult({
            domElement: container,
        });
    }
}

export const signupPage = new SignupPage();
