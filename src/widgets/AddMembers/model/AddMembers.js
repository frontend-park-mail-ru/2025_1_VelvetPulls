import { eventBus } from "../../../shared/modules/EventBus/EventBus.js";

class AddMembers {
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
            eventBus.emit("add members -> new group");
        });

        const memberItems =
            this.container.querySelectorAll(".sidebar-list-item");
        for (const memberItem of memberItems) {
            memberItem.addEventListener("click", (event) => {
                const checkbox = memberItem.querySelector("input");

                if (event.target !== checkbox) {
                    checkbox.checked = !checkbox.checked;
                }
            });
        }

        // Далее (завершить создание чата)
        const buttonNext = this.container.querySelector(
            ".sidebar__fixed-button",
        );
        buttonNext.addEventListener("click", (event) => {
            event.preventDefault();

            const infoMessage = `Эта функция на этапе разработки.

После создания группы вы будете перенаправлены в список чатов, в котором появится созданная группа.

Также сразу же откроется окно чата с этой группой. В чат автоматически добавится сообщение типа "event" со значением "Вы создали группу".`;
            alert(infoMessage);
            eventBus.emit("add members -> next");
        });
    }
}

export const addMembers = new AddMembers();
