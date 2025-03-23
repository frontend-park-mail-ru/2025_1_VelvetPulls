import { root } from "../app/main.js";

import loginPage from "../pages/login/login.js";
import signupPage from "../pages/signup/signup.js";
import chatsPage from "../pages/chats/chats.js";

export const appState = {
    activePageLink: null,
};

const config = {
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
    chats: {
        href: "/chats",
        title: "Keftegram",
        page: chatsPage,
    },
};

export const goToPage = async (page) => {
    root.innerHTML = "";

    appState.activePageLink = page;
    localStorage.setItem("activePageLink", page);

    console.log(`go to page "${page}"`);

    const response = await config[page].page.render();

    if (!response.ok) {
        if (response.error === "invalid session token") {
            goToPage("login");
        }
    }

    window.history.pushState(config[page].href, "", config[page].href);
    document.title = config[page].title;
};
