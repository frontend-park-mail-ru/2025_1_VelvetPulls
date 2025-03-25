import {
    phoneInputListener,
    loginLinkListener,
    signupFormSubmitListener,
    togglePasswordListener,
} from "../../modules/event_listeners.js";

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
        this.buttonText = "Создать аккаунт";
        this.redirectText = "Войдите";
    }

    addListeners() {
        const phoneInput = document.getElementById("phone");
        phoneInput.addEventListener("input", phoneInputListener);

        const signupForm = document.querySelector(".signupForm");
        signupForm.addEventListener("submit", signupFormSubmitListener);

        const loginLink = document.getElementById("loginLink");
        loginLink.addEventListener("click", loginLinkListener);

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

        const loginTemplate = Handlebars.templates["signup.hbs"];

        const fields = this.fields;
        const buttonText = this.buttonText;
        const redirectText = this.redirectText;

        const html = loginTemplate({ fields, buttonText, redirectText });
        const root = document.getElementById("root");
        root.innerHTML = html;
        this.addListeners();

        return {
            ok: true,
            error: "s",
        };
    }
}

const signupPage = new SignupPage();
export default signupPage;
