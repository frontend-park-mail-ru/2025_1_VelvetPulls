import { goToPage } from "../modules/router.js";

export const root = document.getElementById("root");

export const appInit = () => {
    goToPage("login");
};
