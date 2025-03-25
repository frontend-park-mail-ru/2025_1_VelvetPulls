import { ListOfChats } from "../ListOfChats/ListOfChats.js";

export class Contacts {
    getData() {
        return {
            ok: true,
            error: "",
        };
    }

    getHTML() {
        const template = Handlebars.templates["Contacts.hbs"];
        return template();
    }

    addListeners(mainPage) {
        const back = document.getElementsByName("back")[0];

        back.addEventListener("click", (event) => {
            event.preventDefault();

            mainPage.sidebar = new ListOfChats();
            mainPage.render();
        });
    }
}
