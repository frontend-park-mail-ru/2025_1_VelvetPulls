import { Auth } from "../../modules/auth.js";
import { goToPage } from "../../modules/router.js";
import { validateSignupForm } from "../forms_validation.js";

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
                placeholder: "Телефон (123-456-67-89)",
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
        console.log("add listeners");

        const signupForm = document.querySelector(".signupForm");
        if (signupForm && typeof signupForm.addEventListener === "function") {
            signupForm.addEventListener("submit", async (e) => {
                e.preventDefault();

                var form = signupForm.getElementsByTagName("form")[0];
                const formIsValid = validateSignupForm(form);

                if (formIsValid) {
                    console.log("sign up form is not valid");

                    const username = document.getElementById("username").value;
                    const phone = document.getElementById("phone").value;
                    const password = document.getElementById("password").value;
                    const repeatPassword =
                        document.getElementById("confirm-password").value;

                    const auth = new Auth();
                    await auth.register(
                        username,
                        phone,
                        password,
                        repeatPassword,
                    );
                    goToPage("chats");
                } else {
                    console.log("sign up form is valid");
                }
            });
        }

        const loginLink = document.getElementById("loginLink");
        if (loginLink && typeof loginLink.addEventListener === "function") {
            loginLink.addEventListener("click", (e) => {
                e.preventDefault();
                goToPage("login");
            });
        }

        const togglers = document.getElementsByClassName(
            "auth-form__toggle-password",
        );
        for (const toggler of togglers) {
            toggler.addEventListener("click", (event) => {
                event.preventDefault();

                // console.log("toggler", toggler);

                const parent = toggler.parentElement;
                // console.log("parent", parent);

                const input = parent.getElementsByTagName("input")[0];
                // console.log("input", input);

                if (input.type === "password") {
                    input.type = "text";
                    toggler.textContent = "🙈";
                } else {
                    input.type = "password";
                    toggler.textContent = "👁️";
                }
            });
        }
    }

    render() {
        Handlebars.registerHelper("eq", function (a, b) {
            return a === b;
        });

        const loginTemplate = Handlebars.templates["signup.hbs"];
        console.log("render signup");

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
