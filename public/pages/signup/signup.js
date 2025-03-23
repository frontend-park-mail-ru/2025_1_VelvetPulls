import { Auth } from "../../modules/auth.js";
import { goToPage } from "../../modules/router.js";
import { validateSignupForm } from "../../modules/validation.js";

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
        if (phoneInput && typeof phoneInput.addEventListener === "function") {
            phoneInput.addEventListener("input", function (event) {
                let value = event.target.value.replace(/\D/g, "");

                if (value.startsWith("7") || value.startsWith("8")) {
                    value = value.slice(1);
                }

                if (value.length > 10) {
                    value = value.slice(0, 10);
                }

                let formattedValue = "+7";
                if (value.length > 0) {
                    formattedValue += " (" + value.slice(0, 3);
                }
                if (value.length > 3) {
                    formattedValue += ") " + value.slice(3, 6);
                }
                if (value.length > 6) {
                    formattedValue += "-" + value.slice(6, 8);
                }
                if (value.length > 8) {
                    formattedValue += "-" + value.slice(8, 10);
                }

                event.target.value = formattedValue;
            });
        }

        const signupForm = document.querySelector(".signupForm");
        if (signupForm && typeof signupForm.addEventListener === "function") {
            signupForm.addEventListener("submit", async (e) => {
                e.preventDefault();

                let form = signupForm.getElementsByTagName("form")[0];
                const formIsValid = validateSignupForm(form);

                if (formIsValid) {
                    console.log("sign up form is valid");

                    const username = document.getElementById("username").value;
                    const phone = document.getElementById("phone").value;
                    const cleanedPhone = phone.value.replace(/[^+\d]/g, "");
                    const password = document.getElementById("password").value;
                    const repeatPassword =
                        document.getElementById("confirm-password").value;

                    const auth = new Auth();
                    await auth.register(
                        username,
                        cleanedPhone,
                        password,
                        repeatPassword,
                    );
                    goToPage("chats");
                } else {
                    console.log("sign up form is not valid");
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

                const parent = toggler.parentElement;
                const input = parent.getElementsByTagName("input")[0];

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
