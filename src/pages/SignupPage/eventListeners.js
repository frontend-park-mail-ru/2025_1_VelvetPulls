import { goToPage } from "../../shared/helpers/goToPage.js";

export const toLogin = (event) => {
    event.preventDefault();
    goToPage("login");
};
