import { goToPage } from "./goToPage.js";
import {
    validateSignupForm,
    validateLoginForm,
    usernameInputValidate,
    repeatPasswordInputValidate,
    passwordInputValidate,
    createError,
    removeError,
} from "./validation.js";
import { auth } from "../api/auth.js";
import { eventBus } from "../modules/EventBus/EventBus.js";
// import { createError } from "./validation.js";

export const signupFormSubmitListener = async (event) => {
    event.preventDefault();

    const submitButton = document.querySelector(".auth-form__button");
    removeError(submitButton);

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
            eventBus.emit("do update profile");
            goToPage("main");
        } else {
            console.log("response:", response);

            const error = response.error;

            switch (error) {
                case "username is already taken":
                    createError(submitButton, "Введённый username уже занят");
                    break;

                case "phone number is already taken":
                    createError(
                        submitButton,
                        "Введённый телефон уже используется",
                    );
                    break;
            }
        }
    }
};

export const usernameInputListener = (event) => {
    const submitButton = document.querySelector(".auth-form__button");
    removeError(submitButton);

    let input = event.target;
    usernameInputValidate(input);
};

export const passwordInputListener = (event) => {
    const submitButton = document.querySelector(".auth-form__button");
    removeError(submitButton);

    let input = event.target;
    passwordInputValidate(input);
};

export const repeatPasswordInputListener = (event) => {
    const submitButton = document.querySelector(".auth-form__button");
    removeError(submitButton);

    let input = event.target;
    let form = document.getElementsByTagName("form")[0];
    repeatPasswordInputValidate(input, form);
};

export const phoneInputListener = (event) => {
    const submitButton = document.querySelector(".auth-form__button");
    removeError(submitButton);

    const phoneInput = document.querySelector("#phone");
    removeError(phoneInput);

    let value = phoneInput.value.replace(/\D/g, "");

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

    if (value.length < 10) {
        console.log(value.length);
        createError(phoneInput, "Введите телефон полностью");
    }

    phoneInput.value = formattedValue;
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

    const submitButton = document.querySelector(".auth-form__button");
    removeError(submitButton);

    let form = document.getElementsByTagName("form")[0];
    const formIsValid = validateLoginForm(form);

    if (formIsValid) {
        const usernameInput = document.getElementById("username");
        const passwordInput = document.getElementById("password");

        const username = usernameInput.value;
        const password = passwordInput.value;

        const response = await auth.login(username, password);

        console.log("response:", response);

        if (response.status === true) {
            eventBus.emit("do update profile");
            goToPage("main");
        } else {
            console.log("response:", response);

            const error = response.error;

            switch (error) {
                case "invalid password":
                case "invalid username":
                    console.log("invalid username or password");
                    createError(submitButton, "Неверный логин или пароль");
                    break;
            }
        }
    }
};
