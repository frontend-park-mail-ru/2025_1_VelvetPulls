import { phoneInputListener } from "./eventListeners.js";

/**
 * Удаляет пояснительную ошибку рядом с полем ввода, если она там была
 *
 * @function createError
 * @param {input} input - Поле ввода
 *
 */
export function removeError(input) {
    const parent = input.parentNode;

    if (parent.classList.contains("auth-form__error")) {
        parent.querySelector(".error-label").remove();
        parent.classList.remove("auth-form__error");
    }
}

/**
 * Добавляет пояснительную ошибку рядом с полем ввода
 *
 * @function createError
 * @param {input} input - Поле ввода
 * @param {string} text - Сообщение об ошибке
 *
 */
export function createError(input, text) {
    const parent = input.parentNode;
    parent.classList.add("auth-form__error");

    const errorLabel = document.createElement("label");
    errorLabel.classList.add("error-label");
    errorLabel.textContent = text;

    parent.append(errorLabel);
}

/**
 * Валидирует пароль
 *
 * @function checkPassword
 * @param {input} input - Поле ввода для пароля
 * @returns {boolean} - Возвращает true, если пароль корректен, и false иначе
 *
 */
function checkPassword(input) {
    const patt = /^[a-zA-Z0-9!@#$%^&*()_\-+=]{8,32}$/;
    return patt.test(input.value);
}

/**
 * Сверяет введённые пароли
 *
 * @function checkPasswords
 * @param {input} input - Поле ввода для пароля
 * @returns {boolean} - Возвращает true, если пароли совпадают, и false иначе
 *
 */
function isEqualPasswords(form) {
    const password = form.querySelector("#password");
    const confirmPassword = form.querySelector("#confirm-password");
    return password.value === confirmPassword.value;
}

/**
 * Валидирует введённый номера телефона
 *
 * @function checkPhone
 * @param {input} input - Поле ввода для номера телефона
 * @returns {boolean} - Возвращает true, если номер корректен, и false иначе
 *
 */
function checkPhone(input) {
    const cleanedValue = input.value.replace(/[^+\d]/g, "");
    const patt = /^\+7\d{10}|\+1\d{10}|\+44\d{10}|\+49\d{10}$/;
    return patt.test(cleanedValue);
}

/**
 * Валидирует имя пользователя
 *
 * @function checkUsername
 * @param {input} input - Поле ввода для имени пользователя
 * @returns {boolean} - Возвращает true, если имя пользователя корректно, и false иначе
 *
 */
function checkUsername(input) {
    const patt = /^[a-zA-Z0-9_]{3,20}$/;
    return patt.test(input.value);
}

export function usernameInputValidate(input) {
    if (!checkUsername(input)) {
        removeError(input);
        createError(
            input,
            "Введите от 3 до 20 символов, включая латинские буквы, цифры и нижнее подчёркивание",
        );
        return false;
    }
    removeError(input);
    return true;
}

export function cleanedPhoneInputValidate(input) {
    if (!checkPhone(input)) {
        removeError(input);
        createError(input, "Неверный формат номера телефона");
        return false;
    }
    removeError(input);
    return true;
}

export function passwordInputValidate(parent, input) {
    if (!checkPassword(input)) {
        removeError(parent);
        createError(
            parent,
            "Введите от 8 до 32 символов, включая латинские буквы, цифры и нижнее подчёркивание",
        );
        return false;
    }
    removeError(parent);
    return true;
}

export function repeatPasswordInputValidate(parent, form) {
    if (!isEqualPasswords(form)) {
        removeError(parent);
        createError(parent, "Пароли должны совпадать");
        return false;
    }
    removeError(parent);
    return true;
}
/**
 * Валидирует форму
 *
 * @function validateForm
 * @param {form} form - Форма (авторизация или регистрация)
 * @returns {boolean} - Возвращает true, если форма валидна, и false, если невалидна.
 *
 */
export function validateSignupForm(form) {
    let isValid = true;

    const allInputs = form.getElementsByTagName("input");

    for (const input of allInputs) {
        removeError(input);

        if (input.value === "") {
            createError(input, "Поле не заполнено");
            isValid = false;
        } else {
            switch (input["id"]) {
                case "username":
                    isValid = usernameInputValidate(input);
                    break;

                case "phone":
                    isValid = phoneInputListener(input);
                    break;

                case "password":
                    const parentPass = input.closest(".auth-form__input-container"); 
                    isValid = passwordInputValidate(parentPass, input);
                    break;

                case "confirm-password":
                    const parentConfPass = input.closest(".auth-form__input-container"); 
                    isValid = repeatPasswordInputValidate(parentConfPass, form);
                    break;
            }
        }

        if (isValid === false) {
            return false;
        }
    }

    return isValid;
}

export function validateLoginForm(form) {
    let isValid = true;

    const allInputs = form.getElementsByTagName("input");

    for (const input of allInputs) {
        removeError(input);

        if (input.value === "") {
            createError(input, "Поле не заполнено");
            isValid = false;
        } else {
            switch (input["id"]) {
                case "username":
                    isValid = usernameInputValidate(input);
                    break;

                case "phone":
                    isValid = phoneInputListener(input);
                    break;

                case "password":
                    const parentPass = input.closest(".auth-form__input-container"); 
                    isValid = passwordInputValidate(parentPass, input);
                    break;
    
                case "confirm-password":
                    const parentConfPass = input.closest(".auth-form__input-container"); 
                    isValid = repeatPasswordInputValidate(parentConfPass, form);
                    break;
            }
        }

        if (isValid === false) {
            return false;
        }
    }

    return isValid;
}
