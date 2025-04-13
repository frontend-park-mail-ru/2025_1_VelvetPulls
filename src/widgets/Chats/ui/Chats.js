import { eventBus } from "../../../shared/modules/EventBus/EventBus.js";
import { User } from "../../../entities/User/model/User.js";
import { api } from "../../../shared/api/api.js";
import { deleteChat } from "../../../entities/Chat/api/api.js";
import { createChat } from "../../../entities/Chat/api/api.js";

class Chats {
    constructor() {
        this.container = null;
        this.menu = null;
        this.menuIsOpen = false;
        this.newChatIsOpen = false;

        this.getData();
    }

    async getData() {
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

        const responseBody = await api.get("/chats");
        console.log("get chats:", responseBody);

        this.chats = responseBody.data;
        console.log("ChatsInstance:", this);

        // eventBus.emit("chats loaded");
    }

    async getHTML() {
        await this.getData();

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
        const chats = this.container.querySelectorAll(".sidebar-list-item");
        for (let chatNumber = 0; chatNumber < chats.length; chatNumber++) {
            const chat = chats[chatNumber];

            // Открыть чат (ещё не сделано)
            chat.addEventListener("click", async (event) => {
                event.preventDefault();

                console.log("click on chat:", this.chats[chatNumber]);
                console.log("chat title:", this.chats[chatNumber].title);

                const username = this.chats[chatNumber].title;

                const user = new User();
                await user.init(username);
                const chatId = this.chats[chatNumber].id;

                eventBus.emit("open dialog", { user, chatId });
            });

            // Удалить чат
            const deleteChatButton = chat.querySelector(".button");
            deleteChatButton.addEventListener("click", async (event) => {
                event.preventDefault();
                event.stopPropagation();

                const responseBody = await deleteChat(
                    this.chats[chatNumber].id,
                );
                console.log("delete chat:", responseBody);
                // await this.getData();
                eventBus.emit("chat is deleted");
            });
        }

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
            const username = prompt(
                "Введите username пользователя, которому Вы хотите написать",
            );
            console.log("username:", username);

            try {
                const chatData = {
                    type: "dialog",
                    dialog_user: username,
                    title: "1",
                };
                await createChat(chatData);

                eventBus.emit("new chat is created");
            } catch (error) {
                alert("user is not found:", username);
                console.log("error:", error);
            }
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

        // Новый контакт
        const newContact = newChatPopoverElement.querySelector("#new-contact");
        newContact.addEventListener("click", (event) => {
            event.preventDefault();
            this.newChatIsOpen = false;
            eventBus.emit("chats -> new contact");
        });
    }
}

export const chats = new Chats();
