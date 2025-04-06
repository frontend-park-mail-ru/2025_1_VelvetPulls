import { config, appState } from "../../app/router.js";

export const goToPage = async (page, pushState = true) => {
    console.log("go to page:", page);

    if (!config[page]) {
        console.error(`Page "${page}" not found in config`);
        return;
    }

    appState.activePageLink = page;
    localStorage.setItem("activePageLink", page);

    try {
        const renderResult = await config[page].page.render();
        console.log("here");

        if (renderResult.redirect !== null) {
            console.log("redirect:", renderResult.redirect);
            goToPage(renderResult.redirect);
            return;
        }

        if (renderResult.error !== null) {
            console.log("error", renderResult.error);
            return;
        }

        const root = document.getElementById("root");
        root.innerHTML = "";
        root.appendChild(renderResult.domElement);

        if (pushState) {
            window.history.pushState({ page }, "", config[page].href);
        }
        document.title = config[page].title;
    } catch (error) {
        console.error(`Error rendering page "${page}":`, error);
        // goToPage("login");
    }
};
