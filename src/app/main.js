import { appState, initRouter, config } from "./router.js";
import { goToPage } from "../shared/helpers/goToPage.js";
import { initDispatcher } from "./dispatcher.js";

export const appInit = () => {
    initRouter();
    initDispatcher();

    const savedPage = localStorage.getItem("activePageLink");

    const pageFromUrl = Object.entries(config).find(
        ([route]) => route.href === window.location.pathname,
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
