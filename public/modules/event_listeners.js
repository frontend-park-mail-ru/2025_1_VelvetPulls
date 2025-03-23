import { goToPage } from "./router.js";
import { validateSignupForm } from "./validation.js";
import { validateLoginForm } from "./validation.js";
import { Auth } from "./auth.js";

export const signUpFormSubmitListener = async (event) => {
    event.preventDefault();

    let form = document.getElementsByTagName("form")[0];
    const formIsValid = validateSignupForm(form);

    if (formIsValid) {
        const username = document.getElementById("username").value;
        const phone = document.getElementById("phone").value;
        const cleanedPhone = phone.replace(/[^+\d]/g, "");
        const password = document.getElementById("password").value;
        const repeatPassword =
            document.getElementById("confirm-password").value;

        const auth = new Auth();
        await auth.register(username, cleanedPhone, password, repeatPassword);
        goToPage("chats");
    }
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

export const logInLinkListener = (event) => {
    event.preventDefault();
    goToPage("login");
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

export const logInFormSubmit = async (event) => {
    event.preventDefault();

    let form = document.getElementsByTagName("form")[0];
    const formIsValid = validateLoginForm(form);

    if (formIsValid) {
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        const auth = new Auth();
        await auth.login(username, password);
        goToPage("chats");
    }
};

export const signUpLinkListener = (event) => {
    event.preventDefault();
    goToPage("signup");
};
