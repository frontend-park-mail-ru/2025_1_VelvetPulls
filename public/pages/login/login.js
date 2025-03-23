import {
    logInFormSubmit,
    signUpLinkListener,
    togglePasswordListener,
} from "../../modules/event_listeners.js";

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
        this.buttonText = "Войти";
        this.redirectText = "Создать";
    }

    addListeners() {
        const loginForm = document.querySelector(".loginForm");
        loginForm.addEventListener("submit", logInFormSubmit);

        const signupLink = document.getElementById("signupLink");
        signupLink.addEventListener("click", signUpLinkListener);

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
        Handlebars.registerHelper("eq", function (a, b) {
            return a === b;
        });

        const loginTemplate = Handlebars.templates["login.hbs"];

        const fields = this.fields;
        const buttonText = this.buttonText;
        const redirectText = this.redirectText;

        const html = loginTemplate({ fields, buttonText, redirectText });
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
