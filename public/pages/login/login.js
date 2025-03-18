import { authHandler } from "../../handlers/authHandler.js";
import { validateLoginForm } from "../forms_validation.js";

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
        console.log("add listeners");

        const loginForm = document.querySelector(".loginForm");
        if (loginForm && typeof loginForm.addEventListener === "function") {
            loginForm.addEventListener("submit", async (event) => {
                event.preventDefault();

                console.log("form submit");

                var form = loginForm.getElementsByTagName("form")[0];
                const formIsValid = validateLoginForm(form);

                if (formIsValid) {
                    console.log("form is valid, handle login");

                    const username = document.getElementById("username").value;
                    const password = document.getElementById("password").value;
                    await authHandler.handleLogin(username, password);
                } else {
                    console.log("form is not valid");
                }
            });
        }

        const signupLink = document.getElementById("signupLink");
        if (signupLink && typeof signupLink.addEventListener === "function") {
            signupLink.addEventListener("click", (event) => {
                event.preventDefault();
                authHandler.redirectToSignup();
            });
        }

        const togglers = document.getElementsByClassName(
            "auth-form__toggle-password",
        );
        for (const toggler of togglers) {
            console.log(toggler);
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

        const loginTemplate = Handlebars.templates["login.hbs"];
        // const { fields, buttonText, redirectText } = data;

        console.log("in renderLogin");

        console.log(this);

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

const loginPage = new LoginPage();
export default loginPage;
