import { eventBus } from "../../../shared/modules/EventBus/EventBus.js";
import { User } from "../../../entities/User/model/User.js";
import { api } from "../../../shared/api/api.js";

class Chats {
    constructor() {
        this.container = null;
        this.menu = null;
        this.menuIsOpen = false;
        this.newChatIsOpen = false;
        this.handleDocumentClick = this.handleDocumentClick.bind(this);
    }

    getData() {
        // this.chats = [
        //     {
        //         title: "Keftegr@m",
        //         description: "чат с Keftegram",
        //         unreadCount: 1,
        //         avatarUrl: "img/Keftegram.png",
        //     },
        //     {
        //         title: "Поддержка",
        //         description: "Чат с поддержкой",
        //         unreadCount: 0,
        //         avatarUrl: "img/Avatar1.png",
        //     },
        //     {
        //         title: "Общий чат",
        //         description: "Обсуждение новостей",
        //         unreadCount: 3,
        //         avatarUrl: "img/Avatar2.png",
        //     },
        // ];

        this.chats = api.get("/chats");
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
        // Удаляем старые обработчики перед добавлением новых
        document.removeEventListener('click', this.handleDocumentClick);
        
        // Добавляем обработчик на весь документ
        document.addEventListener('click', this.handleDocumentClick);
    }

    handleDocumentClick(event) {
        // Обработка клика по чату
        const chatItem = event.target.closest(".sidebar-list-item");
        if (chatItem) {
            event.preventDefault();
            eventBus.emit("chats: click on chat", "ла-ла-ла");
            return;
        }

        // Обработка клика по кнопке меню
        const menuButton = event.target.closest("#chats-menu");
        if (menuButton) {
            event.preventDefault();
            event.stopPropagation();
            this.toggleMenu();
            return;
        }

        // Обработка клика по кнопке создания чата
        const newChatButton = event.target.closest(".sidebar__fixed-button");
        if (newChatButton) {
            event.preventDefault();
            event.stopPropagation();
            this.toggleNewChat();
            return;
        }

        // Обработка кликов внутри меню
        if (this.menuIsOpen) {
            const menuPopover = this.container?.querySelector("#chats-menu-popover");
            if (menuPopover && !menuPopover.contains(event.target)) {
                this.menuIsOpen = false;
                menuPopover.style.display = "none";
            }

            const profileButton = event.target.closest("#chats-menu-profile");
            if (profileButton) {
                event.preventDefault();
                this.closeMenu();
                eventBus.emit("chats -> profile");
                return;
            }

            const contactsButton = event.target.closest("#chats-menu-contacts");
            if (contactsButton) {
                event.preventDefault();
                this.closeMenu();
                eventBus.emit("chats -> contacts");
                return;
            }
        }

        // Обработка кликов внутри popover нового чата
        if (this.newChatIsOpen) {
            const newChatPopover = this.container?.querySelector("#new-chat__popover");
            if (newChatPopover && !newChatPopover.contains(event.target)) {
                this.newChatIsOpen = false;
                newChatPopover.style.display = "none";
            }

            const newDialogButton = event.target.closest("#new-dialog");
            if (newDialogButton) {
                event.preventDefault();
                this.handleNewDialog();
                return;
            }

            const newGroupButton = event.target.closest("#new-group");
            if (newGroupButton) {
                event.preventDefault();
                this.closeNewChat();
                eventBus.emit("chats -> new group");
                return;
            }

            const newChannelButton = event.target.closest("#new-channel");
            if (newChannelButton) {
                event.preventDefault();
                alert("Создание канала ещё не готово - это требование РК 3");
                return;
            }

            const newContactButton = event.target.closest("#new-contact");
            if (newContactButton) {
                event.preventDefault();
                this.closeNewChat();
                eventBus.emit("chats -> new contact");
                return;
            }
        }
    }

    toggleMenu() {
        const menuPopover = this.container.querySelector("#chats-menu-popover");
        this.menuIsOpen = !this.menuIsOpen;
        menuPopover.style.display = this.menuIsOpen ? "flex" : "none";
    }

    closeMenu() {
        this.menuIsOpen = false;
        const menuPopover = this.container.querySelector("#chats-menu-popover");
        if (menuPopover) menuPopover.style.display = "none";
    }

    toggleNewChat() {
        const newChatPopover = this.container.querySelector("#new-chat__popover");
        this.newChatIsOpen = !this.newChatIsOpen;
        newChatPopover.style.display = this.newChatIsOpen ? "flex" : "none";
    }

    closeNewChat() {
        this.newChatIsOpen = false;
        const newChatPopover = this.container.querySelector("#new-chat__popover");
        if (newChatPopover) newChatPopover.style.display = "none";
    }

    async handleNewDialog() {
        const username = prompt(
            "Введите username пользователя, которому Вы хотите написать"
        );
        console.log("username:", username);
        alert("Здесь будет открываться чат с пользователем");

        // try {
        //     const user = new User();
        //     await user.init(username);
        //     console.log("user:", user);
        //     eventBus.emit("new dialog", user);
        // } catch (error) {
        //     console.log("user is not found:", error);
        // }
    }
}

export const chats = new Chats();
