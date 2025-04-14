import { config, appState } from "../../app/router.js";
import { auth } from "../api/auth.js";

export const goToPage = async (page, pushState = true) => {
    if (!config[page]) {
        console.error(`Page "${page}" not found in config`);
        alert("Page", page, "not found in config");
        return;
    }

    appState.activePageLink = page;
    localStorage.setItem("activePageLink", page);

    try {
        const renderResult = await config[page].page.render();

        if (renderResult.redirect !== null) {
            goToPage(renderResult.redirect);
            return;
        }

        if (renderResult.error !== null) {
            console.error("error", renderResult.error);
            return;
        }

        if (pushState) {
            window.history.pushState({ page }, "", config[page].href);
        }
        document.title = config[page].title;
    } catch (error) {
        console.error(`Error rendering page "${page}":`, error);
        // auth.logout();
        auth.goToPage("login");
    }
};
