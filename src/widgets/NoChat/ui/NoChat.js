import { goToPage } from "../../../shared/helpers/goToPage.js";

class NoChat {
    constructor(parent) {
        this.parent = parent;
    }

    getHTML() {
        const dialogTemplate = Handlebars.templates["NoChat.hbs"];
        const html = dialogTemplate();

        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");
        const container = doc.body.firstChild;
        this.container = container;

        this.bindListeners();

        return container;
    }

    bindListeners() {
        const container = this.container;

        const statisticsLink = container.querySelector(".statistics-link");

        statisticsLink.addEventListener(
            "click",
            this.onStatisticsLinkClick.bind(this),
        );
    }

    onStatisticsLinkClick() {
        // alert("Переход на страницу статистики");
        goToPage("statistics");
    }
}

export const noChat = new NoChat();
