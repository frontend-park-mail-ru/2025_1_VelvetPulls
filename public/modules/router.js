import { root } from '../app/main.js';
import { config } from '../config/routes.js';

const appState = {
    activePageLink: null,
};

export const goToPage = (page) => {
    root.innerHTML = '';

    appState.activePageLink = page;

    const element = config[page].render();

    history.pushState(config[page].href, '', config[page].href);
    document.title = config[page].title;

    root.appendChild(element);
};