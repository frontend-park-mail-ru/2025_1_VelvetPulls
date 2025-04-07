import { PopOver } from "../../shared/modules/PopOver/PopOver.js";

export class Chats {
    constructor(parentWidget) {
        this.parentWidget = parentWidget;
        this.container = null;
        this.popover = null;
    }

    getData() {
        this.chats = [
            {
                title: "Keftegr@m",
                description: "чат с Keftegram",
                unreadCount: 1,
                avatarUrl: "img/Keftegram.png",
            },
            {
                title: "Поддержка",
                description: "Чат с поддержкой",
                unreadCount: 0,
                avatarUrl: "img/Avatar1.png",
            },
            {
                title: "Общий чат",
                description: "Обсуждение новостей",
                unreadCount: 3,
                avatarUrl: "img/Avatar2.png",
            },
        ];
    }

    getHTML() {
        this.getData();

        const template = Handlebars.templates["Chats.hbs"];
        const context = {
            chats: this.chats,
        };

        const html = template(context);

        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");

        const container = doc.body.firstChild;
        this.container = container;

        this.addListeners();

        return container;
    }

    addListeners() {
        const menuButton = this.container.querySelector(".sidebar__menu");

        if (!menuButton) return;

        // Обработчик клика по кнопке меню
        menuButton.addEventListener("click", (event) => {
            event.preventDefault();
            event.stopPropagation();

            if (this.popover) {
                this.closeMenu();
            } else {
                this.openMenu();
            }
        });

        // Закрытие при клике вне popover
        document.addEventListener("click", (event) => {
            if (this.popover && !event.target.closest(".sidebar__menu")) {
                this.closeMenu();
            }
        });

        const createButton = this.container.querySelector("#button-create");
        createButton.addEventListener("click", (event) => {
            event.preventDefault();
            console.log("button create click");
        });
    }

    openMenu() {
        // Закрываем предыдущий popover, если есть
        if (this.popover) {
            this.closeMenu();
        }

        // Создаем новый popover
        this.popover = new PopOver({
            items: [
                {
                    id: "profile",
                    svgPath: "icons/Profile.svg",
                    content: "Профиль",
                },
                {
                    id: "contacts",
                    svgPath: "icons/Contacts.svg",
                    content: "Контакты",
                },
            ],
            position: {
                top: "30px",
                left: "0px",
            },
        });

        const popoverElement = this.popover.getHTML();
        this.setupMenuListeners(popoverElement);

        // Добавляем popover в DOM
        const menuButton = this.container.querySelector(".sidebar__menu");
        menuButton.appendChild(popoverElement);
    }

    closeMenu() {
        if (this.popover) {
            const popoverElement = document.querySelector(".popover");
            if (popoverElement) {
                popoverElement.parentElement.removeChild(popoverElement);
            }
            this.popover = null;
        }
    }

    setupMenuListeners(menuElement) {
        const profile = menuElement.querySelector("#profile");
        profile.addEventListener("click", (event) => {
            event.preventDefault();
            this.closeMenu();

            this.parentWidget.goTo("profile");
        });

        const contacts = menuElement.querySelector("#contacts");
        contacts.addEventListener("click", (event) => {
            event.preventDefault();
            this.closeMenu();

            this.parentWidget.goTo("contacts");
        });
    }
}
