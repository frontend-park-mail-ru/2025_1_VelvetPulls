import { PopOver } from "../../shared/modules/PopOver/PopOver.js";

export class Chats {
    constructor(parentWidget) {
        this.parentWidget = parentWidget;
        this.container = null;
        this.menu = null;
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
        // Обработчик клика по кнопке меню
        const menuButton = this.container.querySelector("#sidebar__menu");
        menuButton.addEventListener("click", (event) => {
            event.preventDefault();
            event.stopPropagation();

            const menuPopover = this.container.querySelector(
                "#sidebar__menu_popover",
            );

            if (this.menuIsOpen) {
                menuPopover.style.display = "none";
                this.menuIsOpen = false;
            } else {
                menuPopover.style.display = "flex";
                this.menuIsOpen = true;
            }
        });

        this.setupMenuListeners();

        const newChatButton = this.container.querySelector("#button-new-chat");
        newChatButton.addEventListener("click", (event) => {
            event.preventDefault();
            event.stopPropagation();

            const menuPopover = this.container.querySelector(
                "#sidebar__new-chat_popover",
            );

            if (this.newChatIsOpen) {
                menuPopover.style.display = "none";
                this.newChatIsOpen = false;
            } else {
                menuPopover.style.display = "flex";
                this.newChatIsOpen = true;
            }
        });

        this.setupNewChatListeners();

        // Закрытие при клике вне popover

        // const createButton = this.container.querySelector("#button-create");
        // createButton.addEventListener("click", (event) => {
        //     event.preventDefault();
        //     console.log("button create click");

        //     this.parentWidget.goTo("create-group");
        // });
    }

    openMenu() {
        console.log("this in openMenu:", this);

        const menuButton = this.container.querySelector("#sidebar__menu");

        // Создаем новый popover
        this.menu = new PopOver({
            parentElement: menuButton,
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

        const popoverElement = this.menu.getHTML();
        this.setupMenuListeners(popoverElement);

        // Добавляем popover в DOM
        menuButton.appendChild(popoverElement);
    }

    // closeMenu() {
    //     if (this.menu) {
    //         const popoverElement = document.querySelector(".popover");
    //         if (popoverElement) {
    //             popoverElement.parentElement.removeChild(popoverElement);
    //         }
    //         this.menu = null;
    //     }
    // }

    setupMenuListeners() {
        const menuPopoverElement = this.container.querySelector(
            "#sidebar__menu_popover",
        );

        const profile = menuPopoverElement.querySelector("#profile");
        profile.addEventListener("click", (event) => {
            event.preventDefault();
            // this.closeMenu();

            this.parentWidget.goTo("profile");
        });

        const contacts = menuPopoverElement.querySelector("#contacts");
        contacts.addEventListener("click", (event) => {
            event.preventDefault();
            // this.closeMenu();

            this.parentWidget.goTo("contacts");
        });
    }

    setupNewChatListeners() {
        const newChatPopoverElement = this.container.querySelector(
            "#sidebar__new-chat_popover",
        );

        const newGroup = newChatPopoverElement.querySelector("#new-group");
        console.log("new group", newGroup);
        newGroup.addEventListener("click", (event) => {
            event.preventDefault();

            this.parentWidget.goTo("create-group");
        });

        const newChannel = newChatPopoverElement.querySelector("#new-channel");
        newChannel.addEventListener("click", (event) => {
            event.preventDefault();

            alert("Создание канала ещё не готово - это требование РК 3");
        });
    }
}
