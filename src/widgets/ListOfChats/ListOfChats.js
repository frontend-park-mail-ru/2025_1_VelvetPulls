import { auth } from "../../shared/api/auth.js";
import { PopOver } from "../../features/PopOver/PopOver.js";
import { Profile } from "../Profile/Profile.js";
import { goToPage } from "../../shared/helpers/goToPage.js";
import { Contacts } from "../Contacts/Contacts.js";

import { mainPage } from "../../pages/MainPage/MainPage.js";

export class ListOfChats {
    constructor() {
        this.sidebar = null;
        this.popover = null;
        this.defaultChats = {
            chats: [
                {
                    title: "Keftegr@m",
                    description: "чат с Keftegram",
                    unreadCount: 1,
                    avatarUrl: "/widgets/ListOfChats/assets/Keftegram.png",
                },
                {
                    title: "Поддержка",
                    description: "Чат с поддержкой",
                    unreadCount: 0,
                    avatarUrl: "/widgets/ListOfChats/assets/Avatar1.png",
                },
                {
                    title: "Общий чат",
                    description: "Обсуждение новостей",
                    unreadCount: 3,
                    avatarUrl: "/widgets/ListOfChats/assets/Avatar2.png",
                },
            ],
        };
    }

    getData() {
        this.chats = this.defaultChats;
    }

    render() {
        this.getData();

        const template = Handlebars.templates["ListOfChats.hbs"];
        const context = {
            chats: this.chats.chats,
            isMockData: this.chats === this.defaultChats,
        };

        const html = template(context);

        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");

        const sidebar = doc.body.firstChild;
        this.sidebar = sidebar;

        this.addListeners();

        return sidebar;
    }

    addListeners() {
        console.log("list of chats add listeners");

        const menuButton = this.sidebar.querySelector(".sidebar__menu");

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
        // document.addEventListener("click", (event) => {
        //     if (this.popover && !event.target.closest(".sidebar__menu")) {
        //         this.closeMenu();
        //     }
        // });
    }

    openMenu() {
        // Закрываем предыдущий popover, если есть
        if (this.popover) {
            this.closeMenu();
        }

        // Создаем новый popover
        this.popover = new PopOver([
            {
                id: "profile",
                svgPath: "/widgets/ListOfChats/assets/ProfileIcon.svg",
                content: "Профиль",
            },
            {
                id: "contacts",
                svgPath: "/widgets/ListOfChats/assets/ContactsIcon.svg",
                content: "Контакты",
            },
            {
                id: "logout",
                svgPath: "/widgets/ListOfChats/assets/LogoutIcon.svg",
                content: "Выйти",
            },
        ]);

        // Добавляем popover в DOM
        const popoverElement = this.popover.getHTML();
        document.body.appendChild(popoverElement);

        popoverElement.style.position = "fixed";
        popoverElement.style.top = "0";
        popoverElement.style.left = "0";
        popoverElement.style.width = "0";
        popoverElement.style.height = "0";
        popoverElement.style.overflow = "visible";

        this.positionPopover(popoverElement);
        this.setupMenuListeners(popoverElement);
    }

    positionPopover(popoverElement) {
        const menuButton = this.sidebar.querySelector(".sidebar__menu");
        const buttonRect = menuButton.getBoundingClientRect();
        const popoverContent = popoverElement.querySelector(".popover");

        if (popoverContent) {
            popoverContent.style.position = "absolute";
            popoverContent.style.top = `${buttonRect.bottom}px`;
            popoverContent.style.left = `${buttonRect.left}px`;
            popoverContent.style.zIndex = "1000";
        }
    }

    closeMenu() {
        if (this.popover) {
            const popoverElement = document.querySelector(".popover-container");
            if (popoverElement) {
                document.body.removeChild(popoverElement);
            }
            this.popover = null;
        }
    }

    setupMenuListeners(menuElement) {
        const logout = menuElement.querySelector("#logout");
        logout.addEventListener("click", (event) => {
            event.preventDefault();
            this.closeMenu();
            auth.logout();
            goToPage("login");
        });

        const profile = menuElement.querySelector("#profile");
        profile.addEventListener("click", (event) => {
            event.preventDefault();
            this.closeMenu();
            this.parentPage.sidebar = new Profile(this.parentPage);
            this.parent.render();
        });

        const contacts = menuElement.querySelector("#contacts");
        contacts.addEventListener("click", (event) => {
            console.log("click on contacts");
            event.preventDefault();
            this.closeMenu();

            mainPage.sidebar = new Contacts();
            goToPage("main");
        });
    }
}
