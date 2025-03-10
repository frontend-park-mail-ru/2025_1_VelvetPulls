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

function checkPasswordLength(input) {
    return input.value.length >= 8;
}

function checkPasswords(form) {
    const password = form.querySelector("#password");
    const confirmPassword = form.querySelector("#confirm-password");
    return password.value === confirmPassword.value;
}

function checkPhone(input) {
    const patt = /^(\+?\d{1,3}[-.\s]?)?(\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}$/;
    return patt.test(input.value);
}

export function validateForm(form) {
    var isValid = true;

    const allInputs = form.getElementsByTagName("input");

    for (const input of allInputs) {
        removeError(input);

        console.log(`input: ${input.name}, value: ${input.value}`);

        if (input.value === "") {
            // console.log("Ошибка поля");
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
