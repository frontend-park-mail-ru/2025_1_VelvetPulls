import { authHandler } from "../../handlers/authHandler.js";

function validateForm(form) {
    function removeError(input) {
        const parent = input.parentNode;

        if (parent.classList.contains("auth-form__error")) {
            parent.querySelector(".error-label").remove();
            parent.classList.remove("auth-form__error");
        }
    }

    function createError(input, text) {
        const parent = input.parentNode;
        parent.classList.add("auth-form__error");

        const errorLabel = document.createElement("label");
        errorLabel.classList.add("error-label");
        errorLabel.textContent = text;

        parent.append(errorLabel);
    }

    var isValid = true;

    const allInputs = form.getElementsByTagName("input");

    for (const input of allInputs) {
        removeError(input);

        console.log(`input: ${input.name}, value: ${input.value}`);

        if (input.value === "") {
            console.log("Ошибка поля");
            createError(input, "Поле не заполнено");
            isValid = false;
        }
    }

    return isValid;
}

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
//todo подумать над правильными рендером прекомпилированных хбс
