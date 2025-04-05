import { ListOfChats } from "../../widgets/ListOfChats/ListOfChats.js";

class MainPage {
    constructor() {
        this.sidebar = new ListOfChats();
    }

    async render() {
        console.log(this.sidebar);

        const response = await this.sidebar.getData();
        if (!response.ok && !response.isMockData) {
            return response;
        }
        const sidebarHTML = this.sidebar.getHTML();
        Handlebars.registerPartial("sidebar", sidebarHTML);

        const mainPageTemplate = Handlebars.templates["MainPage.hbs"];
        console.log(this.sidebar.data, response);
        const html = mainPageTemplate({
            ...this.sidebar.data,
            isMockData: response.isMockData,
        });

        const root = document.getElementById("root");
        root.innerHTML = html;

        this.sidebar.addListeners(this);

        return {
            ok: true,
            error: "",
        };
    }
}

export const mainPage = new MainPage();
