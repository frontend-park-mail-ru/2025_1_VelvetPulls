import { ListOfChats } from "../ListOfChats/ListOfChats.js";

export class Contacts {
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

        return {
            ok: true,
            error: "",
        };
    }

    getHTML() {
        const template = Handlebars.templates["Contacts.hbs"];
        const contacts = this.data;
        return template({ contacts });
    }

    addListeners(mainPage) {
        const back = document.getElementsByName("button-back")[0];

        back.addEventListener("click", (event) => {
            event.preventDefault();

            mainPage.sidebar = new ListOfChats();
            mainPage.render();
        });
    }
}
