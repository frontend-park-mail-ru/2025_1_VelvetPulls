import { loginPage } from "../pages/LoginPage/LoginPage.js";
import { signupPage } from "../pages/SignupPage/SignupPage.js";
import { mainPage } from "../pages/MainPage/MainPage.js";

const root = document.getElementById("root");

export const appState = {
    activePageLink: null,
};

export const config = {
    login: {
        href: "/login",
        title: "Авторизация",
        page: loginPage,
    },
    signup: {
        href: "/signup",
        title: "Регистрация",
        page: signupPage,
    },
    main: {
        href: "/main",
        title: "Keftegram",
        page: mainPage,
    },
};

const handlePopState = () => {
    const path = window.location.pathname;
    const page = Object.entries(config).find(
        ([route]) => route.href === path,
    )?.[0];

    if (page) {
        goToPage(page, false);
    }
};

export const initRouter = () => {
    window.addEventListener("popstate", handlePopState);
};

export const goToPage = async (page, pushState = true) => {
    if (!config[page]) {
        console.error(`Page "${page}" not found in config`);
        return;
    }

    root.innerHTML = "";

    appState.activePageLink = page;
    localStorage.setItem("activePageLink", page);

    //console.log(`go to page "${page}"`);

    try {
        console.log("!");
        const response = await config[page].page.render();

        if (!response.ok) {
            if (response.error === "invalid session token") {
                goToPage("login");
                return;
            }
        }

        if (pushState) {
            window.history.pushState({ page }, "", config[page].href);
        }
        document.title = config[page].title;
    } catch (error) {
        console.error(`Error rendering page "${page}":`, error);
        goToPage("login");
    }
    /*const response = await config[page].page.render();

    if (!response.ok) {
        if (response.error === "invalid session token") {
            goToPage("login");
        }
    }
    
    window.history.pushState(config[page].href, "", config[page].href);
    document.title = config[page].title;*/
};
