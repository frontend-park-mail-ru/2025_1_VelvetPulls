/**
 * Удаляет пояснительную ошибку рядом с полем ввода, если она там была
 *
 * @function createError
 * @param {input} input - Поле ввода
 *
 */
function removeError(input) {
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
function createError(input, text) {
    const parent = input.parentNode;
    parent.classList.add("auth-form__error");

    const errorLabel = document.createElement("label");
    errorLabel.classList.add("error-label");
    errorLabel.textContent = text;

    parent.append(errorLabel);
}

/**
 * Сверяет введённые пароли
 *
 * @function checkPasswordLength
 * @param {input} input - Поле ввода для пароля
 * @returns {boolean} - Возвращает true, если пароль содержит не менее 8 символов, и false иначе
 *
 */
function checkPasswordLength(input) {
    return input.value.length >= 8;
}

/**
 * Сверяет введённые пароли
 *
 * @function checkPasswords
 * @param {input} input - Поле ввода для пароля
 * @returns {boolean} - Возвращает true, если пароль содержит не менее 8 символов, и false иначе
 *
 */
function checkPasswords(form) {
    const password = form.querySelector("#password");
    const confirmPassword = form.querySelector("#confirm-password");
    return password.value === confirmPassword.value;
}

/**
 * Проверяет корректность введённого номера телефона
 *
 * @function checkPhone
 * @param {input} input - Поле ввода для номера телефона
 * @returns {boolean} - Возвращает true, если номер корректер, и false иначе
 *
 */
function checkPhone(input) {
    const patt = /^\+?[1-9]\d{1,14}$/;
    return patt.test(input.value);
}

/**
 * Проверяет форму на корректность введённых данных.
 *
 * @function validateForm
 * @param {form} form - Форма (авторизация или регистрация)
 * @returns {boolean} - Возвращает true, если форма валидна, и false, если невалидна.
 *
 */
export function validateSignupForm(form) {
    var isValid = true;

    const allInputs = form.getElementsByTagName("input");

    for (const input of allInputs) {
        removeError(input);

        console.log(`input: ${input.name}, value: ${input.value}`);

        if (input.value === "") {
            createError(input, "Поле не заполнено");
            isValid = false;
        } else {
            if (input.name === "password") {
                if (!checkPasswordLength(input)) {
                    createError(
                        input,
                        "Пароль должен содержать не меньше 8 символов",
                    );
                    isValid = false;
                }
            }

            if (input.name === "confirm-password") {
                if (!checkPasswords(form)) {
                    createError(input, "Пароли должны совпадать");
                    isValid = false;
                }
            }

            if (input.name === "phone") {
                if (!checkPhone(input)) {
                    removeError(input);
                    createError(input, "Неверный формат номера телефона");
                    isValid = false;
                }
            }
        }
    }

    return isValid;
}

export function validateLoginForm(form) {
    var isValid = true;

    const allInputs = form.getElementsByTagName("input");

    for (const input of allInputs) {
        removeError(input);

        console.log(`input: ${input.name}, value: ${input.value}`);

        if (input.value === "") {
            createError(input, "Поле не заполнено");
            isValid = false;
        } 
    }

    return isValid;
}