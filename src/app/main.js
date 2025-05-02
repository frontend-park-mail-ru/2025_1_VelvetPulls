import { appState, initRouter, config } from "./router.js";
import { goToPage } from "../shared/helpers/goToPage.js";
import { initDispatcher } from "./dispatcher.js";

import { store } from "./store/index.js";
import { chatWebSocket } from "../shared/api/websocket.js";

export const appInit = async () => {
    initRouter();
    initDispatcher();

    let isAuthorized = false;
    if (localStorage.getItem("isAuthorized") === "true") {
        isAuthorized = true;
    }
    if (isAuthorized) {
        await store.init();
        chatWebSocket.connect();
    }

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
