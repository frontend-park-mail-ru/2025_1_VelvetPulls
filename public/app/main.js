import { goToPage } from "../modules/router.js";

export const root = document.getElementById("root");

/**
 * Загружает начальную страницу - форму авторизации
 *
 * @function appInit
 *
 */
export const appInit = () => {
    goToPage("login");
};
