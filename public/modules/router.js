import { root } from "../app/main.js";
import { config } from "../config/routes.js";

export const appState = {
    activePageLink: null,
};

export const goToPage = async (page) => {
    root.innerHTML = "";

    appState.activePageLink = page;
    localStorage.setItem("activePageLink", page);

    const element = config[page].render;
    const renderFunc = element.func;

    try {
        const rendered = await (async () => {
            const result = renderFunc(element.data);
            if (result instanceof Promise) {
                return await result;
            }
            return result;
        })();

        root.innerHTML = rendered.html;
        rendered.addListeners();
    } catch (error) {
        console.error("Ошибка при рендеринге страницы:", error);
        root.innerHTML = "<p>Произошла ошибка при загрузке страницы.</p>";
    }

    history.pushState(config[page].href, "", config[page].href);
    document.title = config[page].title;
};
