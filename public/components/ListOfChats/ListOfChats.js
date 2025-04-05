import { ChatsApi } from "../../modules/chats.js";
import { PopOver } from "../PopOver/PopOver.js";
import { auth } from "../../modules/auth.js";
import { Profile } from "../Profile/Profile.js";
import { goToPage } from "../../modules/router.js";
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
                },
                {
                    title: "Поддержка",
                    description: "Чат с поддержкой",
                    unreadCount: 0,
                },
                {
                    title: "Общий чат",
                    description: "Обсуждение новостей",
                    unreadCount: 3,
                }
            ]
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
                    isMockData: false
                };
            }
            
            console.warn("Using mock chat data:", response?.error || "Backend unavailable");
            this.data = this.defaultChats;
            return {
                ok: false,
                error: response?.error || "Backend unavailable",
                isMockData: true
            };
            
        } catch (error) {
            console.error("Chats API error:", error);
            this.chats = this.defaultChats;
            return {
                ok: false,
                error: error.message,
                isMockData: true
            };
        }
    }

    getHTML() {
        const template = Handlebars.templates["ListOfChats.hbs"];
        const context = { 
            chats: this.chats.chats,
            isMockData: this.chats === this.defaultChats
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
        document.addEventListener('click', (event) => {
            if (this.popover && !event.target.closest('.sidebar__menu')) {
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
                svg: "../../static/img/profile_icon.svg",
                content: "Профиль",
            },
            {
                name: "contacts", 
                svg: "../../static/img/contacts_icon.svg",
                content: "Контакты",
            },
            {
                name: "logout",
                svg: "../../static/img/logout_icon.svg",
                content: "Выйти",
            },
        ]);

        // Добавляем popover в DOM
        const popoverElement = this.popover.getHTML();
        document.body.appendChild(popoverElement);
        
        popoverElement.style.position = 'fixed';
        popoverElement.style.top = '0';
        popoverElement.style.left = '0';
        popoverElement.style.width = '0';
        popoverElement.style.height = '0';
        popoverElement.style.overflow = 'visible';
        
        this.positionPopover(menuButton, popoverElement);
        this.setupPopoverListeners(mainPage, popoverElement);
    }
    
    positionPopover(menuButton, popoverElement) {
        const buttonRect = menuButton.getBoundingClientRect();
        const popoverContent = popoverElement.querySelector('.popover');
        
        if (popoverContent) {
            popoverContent.style.position = 'absolute';
            popoverContent.style.top = `${buttonRect.bottom}px`;
            popoverContent.style.left = `${buttonRect.left}px`;
            popoverContent.style.zIndex = '1000';
        }
    }
    
    closePopover() {
        if (this.popover) {
            const popoverElement = document.querySelector('.popover-container');
            if (popoverElement) {
                document.body.removeChild(popoverElement);
            }
            this.popover = null;
        }
    }
    
    positionPopover(menuButton, popoverElement) {
        const buttonRect = menuButton.getBoundingClientRect();
        
        popoverElement.style.position = 'absolute';
        popoverElement.style.top = `${buttonRect.bottom + window.scrollY}px`;
        popoverElement.style.left = `${buttonRect.left + window.scrollX}px`;
        popoverElement.style.zIndex = '1000';
    }
    
    setupPopoverListeners(mainPage, popoverElement) {
        popoverElement.querySelector('[name="logout"]')?.addEventListener("click", (event) => {
            event.preventDefault();
            this.closePopover();
            auth.logout();
            goToPage("login");
        });

        popoverElement.querySelector('[name="profile"]')?.addEventListener("click", (event) => {
            event.preventDefault();
            this.closePopover();
            mainPage.sidebar = new Profile();
            mainPage.render();
        });

        popoverElement.querySelector('[name="contacts"]')?.addEventListener("click", (event) => {
            event.preventDefault();
            this.closePopover();
            mainPage.sidebar = new Contacts();
            mainPage.render();
        });
    }
}