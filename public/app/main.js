import { appState, goToPage } from "../modules/router.js";

export const root = document.getElementById("root");

export const appInit = () => {
    const savedPage = localStorage.getItem("activePageLink");

    if (savedPage) {
        appState.activePageLink = savedPage;
        goToPage(savedPage);
    } else {
        goToPage("login");
    }
};
