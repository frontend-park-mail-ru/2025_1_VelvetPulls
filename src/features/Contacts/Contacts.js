export class Contacts {
    constructor(parentWidget) {
        this.parentWidget = parentWidget;
        this.container = null;
    }

    getData() {
        // Моковый запрос в БД положит данные в this.data
        this.data = [
            {
                name: "Cameron Williamson",
                photoURL: "img/Avatar.png",
                onlineStatus: "В сети",
            },
            {
                name: "Cameron Williamson",
                photoURL: "img/Avatar.png",
                onlineStatus: "В сети",
            },
            {
                name: "Cameron Williamson",
                photoURL: "img/Avatar.png",
                onlineStatus: "В сети",
            },
        ];
    }

    getHTML() {
        this.getData();

        const template = Handlebars.templates["Contacts.hbs"];
        const contacts = this.data;
        const html = template({ contacts });

        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");

        const domElement = doc.body.firstChild;

        this.container = domElement;

        this.addListeners();

        return domElement;
    }

    addListeners() {
        const back = this.container.querySelector("#button-back");

        back.addEventListener("click", (event) => {
            event.preventDefault();

            this.parentWidget.goTo("chats");
        });
    }
}
