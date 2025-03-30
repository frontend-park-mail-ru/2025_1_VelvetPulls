import { appState, goToPage, initRouter, config } from "../modules/router.js";

export const root = document.getElementById("root");

export const appInit = () => {
    initRouter(); 
    
    const savedPage = localStorage.getItem("activePageLink");
    const currentPath = window.location.pathname.replace(/^\//, '');

    const pageFromUrl = Object.entries(config).find(([_, route]) => 
        route.href === window.location.pathname
    )?.[0];

    if (pageFromUrl) {
        goToPage(pageFromUrl, false);
    } else if (savedPage) {
        appState.activePageLink = savedPage;
        goToPage(savedPage);
    } else {
        goToPage("login");
    }
};
