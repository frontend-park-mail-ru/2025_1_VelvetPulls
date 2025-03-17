import { authHandler } from "../../handlers/authHandler.js";
import { validateLoginForm } from "../forms_validation.js";

export const renderLogin = (data) => {
    Handlebars.registerHelper("eq", function (a, b) {
        return a === b;
    });

    const loginTemplate = Handlebars.templates["login.hbs"];
    const { fields, buttonText, redirectText } = data;
    const html = loginTemplate({ fields, buttonText, redirectText });

    return {
        html,
        addListeners: () => {
            const loginForm = document.querySelector(".loginForm");
            if (loginForm && typeof loginForm.addEventListener === "function") {
                loginForm.addEventListener("submit", async (e) => {
                    e.preventDefault();

                    console.log("form submit");

                    var form = loginForm.getElementsByTagName("form")[0];
                    const formIsValid = validateLoginForm(form);

                    if (formIsValid) {
                        console.log("form is valid, handle login");

                        const username =
                            document.getElementById("username").value;
                        const password =
                            document.getElementById("password").value;
                        await authHandler.handleLogin(username, password);
                    } else {
                        console.log("form is not valid");
                    }
                });
            }

            const signupLink = document.getElementById("signupLink");
            if (
                signupLink &&
                typeof signupLink.addEventListener === "function"
            ) {
                signupLink.addEventListener("click", (e) => {
                    e.preventDefault();
                    authHandler.redirectToSignup();
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
        },
    };
};
