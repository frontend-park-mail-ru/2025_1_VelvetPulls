import { loginPage } from "../pages/LoginPage/LoginPage.js";
import { signupPage } from "../pages/SignupPage/SignupPage.js";
import { mainPage } from "../pages/MainPage/MainPage.js";

import { goToPage } from "../shared/helpers/goToPage.js";

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
