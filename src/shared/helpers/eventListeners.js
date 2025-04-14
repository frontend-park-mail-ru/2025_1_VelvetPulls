import { goToPage } from "./goToPage.js";
import {
    validateSignupForm,
    validateLoginForm,
    usernameInputValidate,
    repeatPasswordInputValidate,
    passwordInputValidate,
} from "./validation.js";
import { auth } from "../api/auth.js";

export const signupFormSubmitListener = async (event) => {
    event.preventDefault();

    let form = document.getElementsByTagName("form")[0];
    const formIsValid = validateSignupForm(form);

    if (formIsValid) {
        const username = document.getElementById("username").value;
        const phone = document.getElementById("phone").value;
        const cleanedPhone = phone.replace(/[^\d]/g, "");
        const password = document.getElementById("password").value;
        const repeatPassword =
            document.getElementById("confirm-password").value;

        const response = await auth.register(
            username,
            cleanedPhone,
            password,
            repeatPassword,
        );
        if (response.status === true) {
            goToPage("main");
        } else {
            alert("ПРОИЗШЛА ОШИБКА!");
        }
    }
};
export const usernameInputListener = (event) => {
    let input = event.target;
    usernameInputValidate(input);
};

export const passwordInputListener = (event) => {
    let input = event.target;
    passwordInputValidate(input);
};

export const repeatPasswordInputListener = (event) => {
    let input = event.target;
    let form = document.getElementsByTagName("form")[0];
    repeatPasswordInputValidate(input, form);
};

export const phoneInputListener = (event) => {
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
};

export const togglePasswordListener = (event, toggler) => {
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
};

export const loginFormSubmit = async (event) => {
    event.preventDefault();

    let form = document.getElementsByTagName("form")[0];
    const formIsValid = validateLoginForm(form);

    if (formIsValid) {
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        const response = await auth.login(username, password);
        if (response.status === true) 
            goToPage("main");
    }
};
