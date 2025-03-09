import { root } from '../app/main.js';
import { config } from '../config/routes.js';

const appState = {
    activePageLink: null,
};

export const goToPage = (page) => {
    root.innerHTML = '';

    appState.activePageLink = page;

    const element = config[page].render;
    const renderFunc = element.func;
    const rendered = renderFunc(element.data); 

    root.innerHTML = rendered.html;
    rendered.addListeners();

    history.pushState(config[page].href, '', config[page].href);
    document.title = config[page].title;

    //root.appendChild(element);
};