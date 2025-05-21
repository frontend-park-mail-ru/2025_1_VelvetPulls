import { goToPage } from "../../shared/helpers/goToPage.js";

export const toSignup = (event) => {
    event.preventDefault();
    goToPage("signup");
};
