import { eventBus } from "../../../shared/modules/EventBus/EventBus.js";
import { User } from "../../../entities/User/model/User.js";
import { api } from "../../../shared/api/api.js";

class Chats {
    constructor() {
        this.container = null;
        this.menu = null;
        this.menuIsOpen = false;
        this.newChatIsOpen = false;
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
        // Клик по чату
        // const chats = this.container.querySelectorAll(".sidebar-list-item");
        // for (const chat of chats) {
        //     chat.addEventListener("click", (event) => {
        //         event.preventDefault();
        //         eventBus.emit("chats: click on chat", "ла-ла-ла");
        //     });
        // }
        document.addEventListener('click', (event) => {
            const chatItem = event.target.closest('.sidebar-list-item');
            if (chatItem) {
                event.preventDefault();
                const chatId = chatItem.dataset.chatId;
                eventBus.emit('chats: click on chat', chatId);
            }
            
        });
        // Обработчик клика по кнопке меню
        const menuButton = this.container.querySelector("#chats-menu");
        menuButton.addEventListener("click", (event) => {
            event.preventDefault();
            event.stopPropagation();

            const menuPopover = this.container.querySelector(
                "#chats-menu-popover",
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

        // Клик по конопке создания чата
        const newChatButton = this.container.querySelector(
            ".sidebar__fixed-button",
        );
        newChatButton.addEventListener("click", (event) => {
            event.preventDefault();
            event.stopPropagation();

            const newChatPopover =
                this.container.querySelector("#new-chat__popover");

            if (this.newChatIsOpen) {
                newChatPopover.style.display = "none";
                this.newChatIsOpen = false;
            } else {
                newChatPopover.style.display = "flex";
                this.newChatIsOpen = true;
            }
        });

        this.setupNewChatListeners();
    }

    setupMenuListeners() {
        const menuPopoverElement = this.container.querySelector(
            "#chats-menu-popover",
        );

        // Профиль
        const profile = menuPopoverElement.querySelector("#chats-menu-profile");
        profile.addEventListener("click", (event) => {
            event.preventDefault();
            this.menuIsOpen = false;
            eventBus.emit("chats -> profile");
        });

        // Контакты
        const contacts = menuPopoverElement.querySelector(
            "#chats-menu-contacts",
        );
        contacts.addEventListener("click", (event) => {
            event.preventDefault();
            this.menuIsOpen = false;
            eventBus.emit("chats -> contacts");
        });
    }

    setupNewChatListeners() {
        const newChatPopoverElement =
            this.container.querySelector("#new-chat__popover");

        // Новый диалог
        const newDialog = newChatPopoverElement.querySelector("#new-dialog");
        newDialog.addEventListener("click", async (event) => {
            event.preventDefault();
            // this.newChatIsOpen = false;
            // eventBus.emit("chats -> new dialog");
            const username = prompt(
                "Введите username пользователя, которому Вы хотите написать",
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
        });

        // Новая группа
        const newGroup = newChatPopoverElement.querySelector("#new-group");
        newGroup.addEventListener("click", (event) => {
            event.preventDefault();
            this.newChatIsOpen = false;
            eventBus.emit("chats -> new group");
        });

        // Новый канал
        const newChannel = newChatPopoverElement.querySelector("#new-channel");
        newChannel.addEventListener("click", (event) => {
            event.preventDefault();
            // this.newChatIsOpen = false;
            // eventBus.emit("chats -> new channel");
            alert("Создание канала ещё не готово - это требование РК 3");
        });

        // Новый канал
        const newContact = newChatPopoverElement.querySelector("#new-contact");
        newContact.addEventListener("click", (event) => {
            event.preventDefault();
            this.newChatIsOpen = false;
            eventBus.emit("chats -> new contact");
        });
    }
}

export const chats = new Chats();
