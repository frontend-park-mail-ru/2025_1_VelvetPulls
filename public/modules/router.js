import { root } from '../app/main';
import { config } from './config/router';

const appState = {
    activePageLink: null,
};

export const goToPage = (page) => {
    root.innerHTML = '';

    appState.activePageLink = page;

    const element = config.menu[page].render();

    history.pushState(config.menu[page].href, '', config.menu[page].href);
    document.title = config.menu[page].title;

    root.appendChild(element);
};