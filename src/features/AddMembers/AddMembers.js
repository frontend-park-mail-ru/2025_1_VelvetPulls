export class AddMembers {
    constructor(parentWidget) {
        this.parentWidget = parentWidget;
        this.container = null;
    }

    getData() {
        // Моковый запрос в БД положит данные в this.data
        this.data = [
            {
                username: "lolkekchebureck",
                fullname: "Cameron Williamson",
                photoURL: "img/Avatar.png",
                onlineStatus: "В сети",
            },
            {
                username: "lolkekchebureck",
                fullname: "Cameron Williamson",
                photoURL: "img/Avatar.png",
                onlineStatus: "В сети",
            },
            {
                username: "lolkekchebureck",
                fullname: "Cameron Williamson",
                photoURL: "img/Avatar.png",
                onlineStatus: "В сети",
            },
            {
                username: "lolkekchebureck",
                fullname: "Cameron Williamson",
                photoURL: "img/Avatar.png",
                onlineStatus: "В сети",
            },
            {
                username: "lolkekchebureck",
                fullname: "Cameron Williamson",
                photoURL: "img/Avatar.png",
                onlineStatus: "В сети",
            },
            {
                username: "lolkekchebureck",
                fullname: "Cameron Williamson",
                photoURL: "img/Avatar.png",
                onlineStatus: "В сети",
            },
            {
                username: "lolkekchebureck",
                fullname: "Cameron Williamson",
                photoURL: "img/Avatar.png",
                onlineStatus: "В сети",
            },
            {
                username: "lolkekchebureck",
                fullname: "Cameron Williamson",
                photoURL: "img/Avatar.png",
                onlineStatus: "В сети",
            },
            {
                username: "lolkekchebureck",
                fullname: "Cameron Williamson",
                photoURL: "img/Avatar.png",
                onlineStatus: "В сети",
            },
            {
                username: "lolkekchebureck",
                fullname: "Cameron Williamson",
                photoURL: "img/Avatar.png",
                onlineStatus: "В сети",
            },
            {
                username: "lolkekchebureck",
                fullname: "Cameron Williamson",
                photoURL: "img/Avatar.png",
                onlineStatus: "В сети",
            },
            {
                username: "lolkekchebureck",
                fullname: "Cameron Williamson",
                photoURL: "img/Avatar.png",
                onlineStatus: "В сети",
            },
        ];
    }

    getHTML() {
        this.getData();

        const template = Handlebars.templates["AddMembers.hbs"];
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
        // Назад (создать группу)
        const buttonBack = this.container.querySelector("#button-back");
        buttonBack.addEventListener("click", (event) => {
            event.preventDefault();

            this.parentWidget.goTo("create-group");
        });

        const memberItems = this.container.querySelectorAll(
            ".contacts__contact-item",
        );
        for (const memberItem of memberItems) {
            memberItem.addEventListener("click", (event) => {
                const checkbox = memberItem.querySelector("input");

                if (event.target !== checkbox) {
                    checkbox.checked = !checkbox.checked;
                }
            });
        }

        // Далее (завершить создание чата)
        const buttonNext = this.container.querySelector("#button-next");
        buttonNext.addEventListener("click", (event) => {
            event.preventDefault();

            const infoMessage = `Эта функция на этапе разработки.

После создания группы вы будете перенаправлены в список чатов, в котором появится созданная группа.

Также сразу же откроется окно чата с этой группой. В чат автоматически добавится сообщение типа "event" со значением "Вы создали группу".`;
            alert(infoMessage);
            this.parentWidget.goTo("chats");
        });
    }
}
