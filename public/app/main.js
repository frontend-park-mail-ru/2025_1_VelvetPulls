import { appState, goToPage } from "../modules/router.js";
import { config } from "../config/routes.js";

export const root = document.getElementById("root");

export const appInit = () => {
    const savedPage = localStorage.getItem("activePageLink");
    if (savedPage === "chats" && !localStorage.getItem("token")) {
        alert("Доступ запрещен. Пожалуйста, авторизуйтесь.");
        goToPage("login");
        return;
    }

    
    if (savedPage) {
        appState.activePageLink = savedPage;
        goToPage(savedPage);
    } else {
        goToPage("login");
    }

    window.addEventListener("popstate", (event) => {
        const path = window.location.pathname;
        const page = Object.keys(config).find((key) => config[key].href === path);
        if (page) {
            goToPage(page);
        }
    });
};
