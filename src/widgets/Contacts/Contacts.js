import { goToPage } from "../../shared/helpers/goToPage.js";
import { ListOfChats } from "../ListOfChats/ListOfChats.js";
import { mainPage } from "../../pages/MainPage/MainPage.js";

export class Contacts {
    constructor() {
        this.sidebar = null;
    }

    getData() {
        // Моковый запрос в БД положит данные в this.data
        this.data = [
            {
                name: "Cameron Williamson",
                photoURL: "/widgets/Contacts/assets/Avatar.png",
                onlineStatus: "В сети",
            },
            {
                name: "Cameron Williamson",
                photoURL: "/widgets/Contacts/assets/Avatar.png",
                onlineStatus: "В сети",
            },
            {
                name: "Cameron Williamson",
                photoURL: "/widgets/Contacts/assets/Avatar.png",
                onlineStatus: "В сети",
            },
        ];
    }

    render() {
        this.getData();

        const template = Handlebars.templates["Contacts.hbs"];
        const contacts = this.data;
        const html = template({ contacts });

        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");

        const domElement = doc.body.firstChild;

        this.sidebar = domElement;

        this.addListeners();

        return domElement;
    }

    addListeners() {
        const back = this.sidebar.querySelector("#button-back");

        back.addEventListener("click", (event) => {
            event.preventDefault();

            mainPage.sidebar = new ListOfChats();
            goToPage("main");
        });
    }
}
