import { RenderResult } from "../../shared/modules/RenderResponse.js";
import { ListOfChats } from "../../widgets/ListOfChats/ListOfChats.js";
// import { Contacts } from "../../widgets/Contacts/Contacts.js";
// import { goToPage } from "../../shared/helpers/goToPage.js";

class MainPage {
    constructor() {
        this.sidebar = new ListOfChats();
    }

    async render() {
        const mainPageTemplate = Handlebars.templates["MainPage.hbs"];
        const html = mainPageTemplate({});

        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");

        const container = doc.body.firstChild;

        const sidebar = this.sidebar.render();
        console.log(sidebar);
        container.insertBefore(sidebar, container.firstChild);
        console.log(container);

        const root = document.getElementById("root");
        root.appendChild(container);

        return new RenderResult({
            domElement: container,
        });
    }
}

export const mainPage = new MainPage();
