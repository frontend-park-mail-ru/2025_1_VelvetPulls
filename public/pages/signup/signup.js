import { authHandler } from "../../handlers/authHandler.js";
import { validateSignupForm } from "../forms_validation.js";
export const renderSignup = (data) => {
    const signupTemplate = Handlebars.templates["signup.hbs"];
    const { fields, buttonText, redirectText } = data;
    const html = signupTemplate({ fields, buttonText, redirectText });

    return {
        html,
        addListeners: () => {
            const signupForm = document.querySelector(".signupForm");
            if (
                signupForm &&
                typeof signupForm.addEventListener === "function"
            ) {
                signupForm.addEventListener("submit", async (e) => {
                    e.preventDefault();

                    var form = signupForm.getElementsByTagName("form")[0];
                    const formIsValid = validateSignupForm(form);

                    if (formIsValid) {
                        console.log("sign up form is not valid");

                        const username =
                            document.getElementById("username").value;
                        const phone = document.getElementById("phone").value;
                        const password =
                            document.getElementById("password").value;
                        const repeatPassword =
                            document.getElementById("confirm-password").value;
                        await authHandler.handleRegister(
                            username,
                            phone,
                            password,
                            repeatPassword,
                        );
                    } else {
                        console.log("sign up form is valid");
                    }
                });
            }

            const loginLink = document.getElementById("loginLink");
            if (loginLink && typeof loginLink.addEventListener === "function") {
                loginLink.addEventListener("click", (e) => {
                    e.preventDefault();
                    authHandler.redirectToLogin();
                });
            }
        },
    };
};
