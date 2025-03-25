import {
    loginFormSubmit,
    signupLinkListener,
    togglePasswordListener,
} from "../../modules/eventListeners.js";
import { AuthForm } from "../../components/AuthForm/AuthForm.js";

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
        this.redirectText = "Создать";
    }

    addListeners() {
        const loginForm = document.querySelector(".loginForm");
        loginForm.addEventListener("submit", loginFormSubmit);

        const signupLink = document.getElementById("signupLink");
        signupLink.addEventListener("click", signupLinkListener);

        const togglers = document.getElementsByClassName(
            "auth-form__toggle-password",
        );
        for (const toggler of togglers) {
            toggler.addEventListener("click", (event) => {
                togglePasswordListener(event, toggler);
            });
        }
    }

    render() {
        const loginTemplate = Handlebars.templates["login.hbs"];

        const fields = this.fields;
        const submitButtonText = this.submitButtonText;

        const loginForm = new AuthForm(fields, submitButtonText);
        const loginFormHTML = loginForm.getHTML();
        Handlebars.registerPartial("loginForm", loginFormHTML);

        const redirectText = this.redirectText;
        const html = loginTemplate({ redirectText });

        const root = document.getElementById("root");
        root.innerHTML = html;

        this.addListeners();

        return {
            ok: true,
            error: "",
        };
    }
}

const loginPage = new LoginPage();
export default loginPage;
