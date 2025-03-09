import { root } from '../app/main.js';
import { config } from '../config/routes.js';

const appState = {
    activePageLink: null,
};

export const goToPage = (page) => {
    console.log("go to page", page);

    root.innerHTML = '';

    appState.activePageLink = page;

    const element = config[page].render;
    root.innerHTML = element;
};