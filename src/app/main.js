import { appState, initRouter, config } from "./router.js";
import { goToPage } from "../shared/helpers/goToPage.js";
import { initDispatcher } from "./dispatcher.js";

// import { api } from "../shared/api/api.js";

// const getCsrfToken = async () => {
//     console.log("get csrf");
//     const response = await api.get("/csrf");
//     console.log("get csrf response:", response);
//     const csrfToken = response.data["csrf_token"];
//     console.log("csrf token:", csrfToken);
//     return csrfToken;
// };

// export const csrfToken = await getCsrfToken();

export const appInit = () => {
    // getCsrfToken();

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
