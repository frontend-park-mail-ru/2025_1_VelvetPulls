import { eventBus } from "../../../shared/modules/EventBus/EventBus.js";
import { currentUser, User } from "../../../entities/User/model/User.js";
import { api } from "../../../shared/api/api.js";
import { deleteChat } from "../../../entities/Chat/api/api.js";
import { createChat } from "../../../entities/Chat/api/api.js";
import { getAvatar } from "../../../shared/helpers/getAvatar.js";
import { chatWebSocket } from "../../../shared/api/websocket.js";

class Chats {
    constructor() {
        this.container = null;
        this.menu = null;
        this.menuIsOpen = false;
        this.newChatIsOpen = false;

        this.getData();

        eventBus.on("group is edited", this.onGroupEdit.bind(this));
    }

    async getData() {
        const responseBody = await api.get("/chats");
        this.chats = responseBody.data;
    }

    async getHTML() {
        await this.getData();

        const template = Handlebars.templates["Chats.hbs"];
        const chats = [];

        if (this.chats !== null && this.chats !== undefined) {
            for (const chat of this.chats) {
                console.log("chat:", chat);

                let isOwner = true;
                if (chat["type"] == "group") {
                    const responseBody = await api.get(`/chat/${chat["id"]}`);
                    console.log("group response:", responseBody);

                    const users = responseBody["data"]["users"];
                    console.log("group users:", users);

                    const currentMember = users.find(
                        (item) =>
                            item["username"] === currentUser.getUsername(),
                    );
                    console.log("current member:", currentMember);

                    if (currentMember["role"] === "member") {
                        isOwner = false;
                    }
                }

                const chatInfo = {
                    title: chat.title,
                    // lastMessage:
                    avatarSrc: await getAvatar(chat.avatar_path),
                    chatId: chat.id,
                    isOwner: isOwner,
                };

                chats.push(chatInfo);
            }
        }

        const html = template({ chats });

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
        for (let i = 0; i < chats.length; ++i) {
            const chatElement = chats[i];
            const chatModel = this.chats[i];

            // Открыть чат
            chatElement.addEventListener("click", async (event) => {
                event.preventDefault();

                switch (chatModel.type) {
                    case "dialog": {
                        const chatId = chatModel.id;

                        const username = chatModel.title;
                        const user = new User();
                        await user.init(username);

                        eventBus.emit("open dialog", { user, chatId });
                        break;
                    }

                    case "group": {
                        eventBus.emit("open group", chatModel.id);
                    }
                }
            });

            // Удалить чат
            const deleteChatButton = chatElement.querySelector(".button");
            if (deleteChatButton !== null) {
                deleteChatButton.addEventListener("click", async (event) => {
                    event.preventDefault();
                    event.stopPropagation();

                    await deleteChat(chatModel.id);
                    eventBus.emit("chat is deleted");
                });
            }
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
            eventBus.emit("chats -> new dialog");
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

    onGroupEdit(data) {
        this.title = data.title;
        this.avatarSrc = data.avatarSrc;

        const chatContainer = this.container.querySelector(
            `#chat-${data.chatId}`,
        );

        const title = chatContainer.querySelector(
            ".sidebar-list-item__full-name",
        );
        title.innerHTML = this.title;

        const avatar = chatContainer.querySelector(".avatar");
        avatar.src = this.avatarSrc;
    }
}

export const chats = new Chats();
