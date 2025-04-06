import {
    loginFormSubmit,
    togglePasswordListener,
} from "../../shared/helpers/eventListeners.js";

import { toSignup } from "./eventListeners.js";
import { RenderResult } from "../../shared/modules/RenderResponse.js";
import { AuthForm } from "../../widgets/AuthForm/AuthForm.js";

class LoginPage {
    constructor() {
        this.fields = [
            {
                type: "text",
                id: "username",
                name: "username",
                placeholder: "Имя пользователя",
            },
            {
                type: "password",
                id: "password",
                name: "password",
                placeholder: "Пароль",
            },
        ];
        this.submitButtonText = "Войти";
    }

    addListeners() {
        const loginForm = this.container.querySelector(".auth-form");
        loginForm.addEventListener("submit", loginFormSubmit);

        const togglers = this.container.querySelectorAll(
            "auth-form__toggle-password",
        );
        for (const toggler of togglers) {
            toggler.addEventListener("click", (event) => {
                togglePasswordListener(event, toggler);
            });
        }

        // -------------------------

        const signupLink = this.container.querySelector(".register-link");
        console.log("link", signupLink);
        signupLink.addEventListener("click", toSignup);
    }

    render() {
        const loginPageTemplate = Handlebars.templates["LoginPage.hbs"];
        const html = loginPageTemplate({});

        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");
        const container = doc.body.firstChild;
        this.container = container;

        const fields = this.fields;
        const submitButtonText = this.submitButtonText;

        const loginForm = new AuthForm(fields, submitButtonText);
        const loginFormDomElement = loginForm.render();

        const logo = container.querySelector("#main-auth__logo");
        logo.after(loginFormDomElement);

        console.log(this.container);

        this.addListeners();

        return new RenderResult({
            domElement: container,
        });
    }
}

export const loginPage = new LoginPage();
