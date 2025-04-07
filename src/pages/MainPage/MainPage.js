import { RenderResult } from "../../entities/RenderResponse.js";
// import { Chats } from "../../features/Chats/Chats.js";
import { Sidebar } from "../../widgets/Sidebar/Sidebar.js";

class MainPage {
    constructor() {
        this.sidebar = new Sidebar();
    }

    async render() {
        const mainPageTemplate = Handlebars.templates["MainPage.hbs"];
        const html = mainPageTemplate({});

        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");

        const container = doc.body.firstChild;

        const sidebar = this.sidebar.getHTML();
        container.insertBefore(sidebar, container.firstChild);

        const root = document.getElementById("root");
        root.innerHTML = "";
        root.appendChild(container);

        return new RenderResult({});
    }
}

export const mainPage = new MainPage();
