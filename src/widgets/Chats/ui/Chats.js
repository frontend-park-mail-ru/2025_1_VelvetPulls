import { eventBus } from "../../../shared/modules/EventBus/EventBus.js";
import { deleteChat } from "../../../entities/Chat/api/api.js";
import { currentUser, User } from "../../../entities/User/model/User.js";
import { api } from "../../../shared/api/api.js";
import { getAvatar } from "../../../shared/helpers/getAvatar.js";
class Chats {
    constructor() {
        this.container = null;
        this.menu = null;
        this.menuIsOpen = false;
        this.newChatIsOpen = false;

        eventBus.on("group is edited", this.onGroupEdit.bind(this));
    }
    async getData() {
        const responseBody = await api.get("/chats");
        this.chats = responseBody.data;
    }
    async getHTML() {
        //const chats = store.chats;
        await this.getData();
        const template = Handlebars.templates["Chats.hbs"];

        const chats = [];

        if (this.chats !== null && this.chats !== undefined) {
            for (const chat of this.chats) {
                let isOwner = true;
                if (chat["type"] == "group") {
                    const responseBody = await api.get(`/chat/${chat["id"]}`);

                    const users = responseBody["data"]["users"];

                    const currentMember = users.find(
                        (item) =>
                            item["username"] === currentUser.getUsername(),
                    );

                    if (currentMember["role"] === "member") {
                        isOwner = false;
                    }
                }

                const chatInfo = {
                    title: chat.title,
                    id: chat.id,
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
        const finder = this.container.querySelector(".sidebar-header__search-input")
        finder.addEventListener('keypress', async function (event) {
            if (event.key === 'Enter') {
                document.querySelector(".scrollable").innerHTML = ""
                const responseBody1 = await api.get(`/search?query=${finder.value}`);
                this.chats1 = responseBody1.data;
                const chats1 = [];

                if (this.chats1 !== null && this.chats1 !== undefined) {
                    for (const chat of this.chats1) {
                        let isOwner = true;
                        if (chat["type"] == "group") {
                            const responseBody = await api.get(`/chat/${chat["id"]}`);

                            const users = responseBody["data"]["users"];

                            const currentMember = users.find(
                                (item) =>
                                    item["username"] === currentUser.getUsername(),
                            );

                            if (currentMember["role"] === "member") {
                                isOwner = false;
                            }
                        }

                        const chatInfo = {
                            title: chat.title,
                            id: chat.id,
                            // lastMessage:
                            avatarSrc: await getAvatar(chat.avatar_path),
                            chatId: chat.id,
                            isOwner: isOwner,
                        };

                        chats1.push(chatInfo);

                        const templateSource = `
                            <div class="sidebar-list__item sidebar-list-item" id="{{id}}">
                                <img src="{{avatarSrc}}" alt="User avatar" class="avatar">

                                <div class="sidebar-list-item__info">
                                    <div class="sidebar-list-item__full-name">{{title}}</div>
                                    <div class="sidebar-list-item__message-preview">{{lastMessage}}</div>
                                </div>
                                
                                {{#if isOwner}}
                                    <button class="button">
                                        <img src="icons/delete.svg" alt="Delete" class="icon">
                                    </button>
                                {{/if}}
                            </div>
                        `;
                        const template1 = Handlebars.compile(templateSource);

                        let chatData = chatInfo
                        // Создаем HTML из шаблона с данными
                        const html1 = template1(chatData);
                        const container1 = document.querySelector('.scrollable');
                        if (container1) {
                            const tempDiv = document.createElement('div');
                            tempDiv.innerHTML = html1;
                            container1.appendChild(tempDiv.firstElementChild);
                        }
                    }
                }
                else {
                    document.querySelector(".scrollable").innerHTML = "<p style='font-family: var(--font-family);'>Чатов не найдено</p>"
                }
                // console.log(chats1)
                // console.log(document.querySelector(".scrollable"))

                const chats = document.querySelectorAll(".sidebar-list-item");
                for (let i = 0; i < chats.length; ++i) {
                    const chatElement = chats[i];
                    const chatModel = this.chats1[i];

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

                            case "channel": {
                                eventBus.emit("open channel", chatModel.id);
                            }
                        }
                    });

                    // Удалить чат
                    const deleteChatButton = chatElement.querySelector(".button");
                    if (deleteChatButton !== null) {
                        deleteChatButton.addEventListener("click", async (event) => {
                            event.preventDefault();
                            event.stopPropagation();
                            const response = await api.get(`/chat/${chatModel.id}`);
                            //console.log(response.data.users[0].role==="owner", response.data.users[0].username!==currentUser.getUsername())
                            if ((response.data.users[0].role === "owner") && (response.data.users[0].username !== currentUser.getUsername())) {
                                await api.post(`/chat/${chatModel.id}/leave`);
                            } else {
                                await deleteChat(chatModel.id);
                            }
                            eventBus.emit("chat is deleted", chatModel);
                        });
                    }
                }
            }
        })
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
                        break;
                    }

                    case "channel": {
                        eventBus.emit("open channel", chatModel.id);
                    }
                }
            });

            // Удалить чат
            const deleteChatButton = chatElement.querySelector(".button");
            if (deleteChatButton !== null) {
                deleteChatButton.addEventListener("click", async (event) => {
                    event.preventDefault();
                    event.stopPropagation();

                    const response = await api.get(`/chat/${chatModel.id}`);
                    // console.log(response.data.users[0].role==="owner", response.data.users[0].username!==currentUser.getUsername())
                    if ((response.data.users[0].role === "owner") && (response.data.users[0].username !== currentUser.getUsername())) {
                        await api.post(`/chat/${chatModel.id}/leave`);
                    } else {
                        await deleteChat(chatModel.id);
                    }

                    //await deleteChat(chatModel.id);
                    eventBus.emit("chat is deleted", chatModel);

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


        const newChannel = newChatPopoverElement.querySelector("#new-channel");
        newChannel.addEventListener("click", (event) => {
            event.preventDefault();
            this.newChatIsOpen = false;
            eventBus.emit("chats -> new channel");
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

        const title = document.querySelector(
            ".sidebar-list-item__full-name",
        );
        title.innerHTML = this.title;

        const avatar = document.querySelector(".avatar");
        avatar.src = this.avatarSrc;
    }
}

export const chats = new Chats();
