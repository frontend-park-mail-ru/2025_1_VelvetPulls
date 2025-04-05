import { auth } from "../../shared/api/auth.js";
import { ChatsApi } from "../../shared/api/chats.js";
import { PopOver } from "../PopOver/PopOver.js";
import { Profile } from "../Profile/Profile.js";
import { goToPage } from "../../app/router.js";
import { Contacts } from "../Contacts/Contacts.js";

export class ListOfChats {
    constructor() {
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

    async getData() {
        try {
            const chatsInstance = new ChatsApi();
            const response = await chatsInstance.getChats();

            if (response && response.status !== false) {
                this.data = response.data;
                return {
                    ok: true,
                    error: "",
                    isMockData: false,
                };
            }

            // console.warn(
            //     "Using mock chat data:",
            //     response?.error || "Backend unavailable",
            // );
            this.data = this.defaultChats;
            return {
                ok: false,
                error: response?.error || "Backend unavailable",
                isMockData: true,
            };
        } catch (error) {
            // console.error("Chats API error:", error);
            this.chats = this.defaultChats;
            return {
                ok: false,
                error: error.message,
                isMockData: true,
            };
        }
    }

    getHTML() {
        const template = Handlebars.templates["ListOfChats.hbs"];
        const context = {
            chats: this.chats.chats,
            isMockData: this.chats === this.defaultChats,
        };
        return template(context);
    }

    addListeners(mainPage) {
        const menuButton = document.querySelector(".sidebar__menu");

        if (!menuButton) return;

        // Обработчик клика по кнопке меню
        menuButton.addEventListener("click", (event) => {
            event.preventDefault();
            event.stopPropagation();

            if (this.popover) {
                this.closePopover();
            } else {
                this.openPopover(menuButton, mainPage);
            }
        });

        // Закрытие при клике вне popover
        document.addEventListener("click", (event) => {
            if (this.popover && !event.target.closest(".sidebar__menu")) {
                this.closePopover();
            }
        });
    }

    openPopover(menuButton, mainPage) {
        // Закрываем предыдущий popover, если есть
        if (this.popover) {
            this.closePopover();
        }

        // Создаем новый popover
        this.popover = new PopOver([
            {
                name: "profile",
                svgPath: "/widgets/ListOfChats/assets/ProfileIcon.svg",
                content: "Профиль",
            },
            {
                name: "contacts",
                svgPath: "/widgets/ListOfChats/assets/ContactsIcon.svg",
                content: "Контакты",
            },
            {
                name: "logout",
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

        this.positionPopover(menuButton, popoverElement);
        this.setupPopoverListeners(mainPage, popoverElement);
    }

    positionPopover(menuButton, popoverElement) {
        const buttonRect = menuButton.getBoundingClientRect();
        const popoverContent = popoverElement.querySelector(".popover");

        if (popoverContent) {
            popoverContent.style.position = "absolute";
            popoverContent.style.top = `${buttonRect.bottom}px`;
            popoverContent.style.left = `${buttonRect.left}px`;
            popoverContent.style.zIndex = "1000";
        }
    }

    closePopover() {
        if (this.popover) {
            const popoverElement = document.querySelector(".popover-container");
            if (popoverElement) {
                document.body.removeChild(popoverElement);
            }
            this.popover = null;
        }
    }

    setupPopoverListeners(mainPage, popoverElement) {
        popoverElement
            .querySelector('[name="logout"]')
            ?.addEventListener("click", (event) => {
                event.preventDefault();
                this.closePopover();
                auth.logout();
                goToPage("login");
            });

        popoverElement
            .querySelector('[name="profile"]')
            ?.addEventListener("click", (event) => {
                event.preventDefault();
                this.closePopover();
                mainPage.sidebar = new Profile();
                mainPage.render();
            });

        popoverElement
            .querySelector('[name="contacts"]')
            ?.addEventListener("click", (event) => {
                event.preventDefault();
                this.closePopover();
                mainPage.sidebar = new Contacts();
                mainPage.render();
            });
    }
}
