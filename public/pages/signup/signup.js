import {
    phoneInputListener,
    loginLinkListener,
    signupFormSubmitListener,
    togglePasswordListener,
} from "../../modules/eventListeners.js";
import { AuthForm } from "../../components/AuthForm/AuthForm.js";

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
        const fields = this.fields;
        const submitButtonText = this.submitButtonText;

        const signupForm = new AuthForm(fields, submitButtonText);
        const signupFormHTML = signupForm.getHTML();
        Handlebars.registerPartial("signupForm", signupFormHTML);

        const loginTemplate = Handlebars.templates["signup.hbs"];

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

const signupPage = new SignupPage();
export default signupPage;
