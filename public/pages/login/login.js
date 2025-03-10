import { authHandler } from "../../handlers/authHandler.js";
import { validateForm } from "../forms_validation.js";

export const renderLogin = (data) => {
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
                    const formIsValid = validateForm(form);

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
        },
    };
};
