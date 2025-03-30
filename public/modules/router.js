import { root } from "../app/main.js";
import loginPage from "../pages/login/login.js";
import signupPage from "../pages/signup/signup.js";
import mainPage from "../pages/mainPage/mainPage.js";

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

const handlePopState = (event) => {
    const path = window.location.pathname;
    const page = Object.entries(config).find(([_, route]) => 
        route.href === path
    )?.[0];
    
    if (page) {
        goToPage(page, false);
    }
};

export const initRouter = () => {
    window.addEventListener('popstate', handlePopState);
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
        console.log('!');
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
};