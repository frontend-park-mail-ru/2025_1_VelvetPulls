import { RenderResult } from "../../shared/helpers/RenderResponse.js";

import { auth } from "../../shared/api/auth.js";

import { addMembers } from "../../widgets/AddMembers/index.js";
import { chats } from "../../widgets/Chats/index.js";
import { contacts } from "../../widgets/Contacts/index.js";
import { createGroup } from "../../widgets/CreateGroup/index.js";
import { createContact } from "../../widgets/CreateContact/index.js";

import { profile } from "../../widgets/Profile/index.js";
import { editProfile } from "../../widgets/EditProfile/index.js";

import { noChat } from "../../widgets/NoChat/index.js";
// import { dialog } from "../../widgets/Dialog/index.js";
import { group } from "../../widgets/Group/index.js";

import { eventBus } from "../../shared/modules/EventBus/EventBus.js";
import { goToPage } from "../../shared/helpers/goToPage.js";
import { dialog } from "../../widgets/Dialog/ui/Dialog.js";
import { getMessageHistory, sendMessage } from "../../entities/Message/index.js";
import { ChatWebSocket } from "../../shared/api/websocket.js";

class MainPage {
    constructor() {
        this.sidebar = chats;
        this.chat = noChat;
        this.currentChatId = null;
        this.currentChatType = null;
        this.messages = [];
        this.chatSocket = new ChatWebSocket('ws://localhost:8080/ws');

        this.addListeners();
        this.initWebSocketListeners();
    }

    initWebSocketListeners() {
        this.chatSocket.on('NEW_MESSAGE', (message) => {
            if (message.chatId === this.currentChatId) {
                this.messages.push(message);
                this.renderMessage(message);
            }
        });
    }

    async loadMessageHistory(chatId) {
        try {
            const response = await getMessageHistory(chatId);
            if (response.ok) {
                this.messages = response.data.messages;
                this.renderMessages();
            }
        } catch (error) {
            console.error('Error loading message history:', error);
        }
    }
    renderMessages() {
        const messagesContainer = document.querySelector('.dialog__messages');
        if (!messagesContainer) return;

        messagesContainer.innerHTML = this.messages.length === 0
            ? '<div class="dialog__empty">Пока нет сообщений...</div>'
            : this.messages.map(msg => this.createMessageElement(msg)).join('');
    }

    createMessageElement(message) {
        if (this.currentChatType === 'group') {
            return `
                <div class="message-container">
                    <div class="message_${message.isOutgoing ? 'my' : 'group'}">
                        ${!message.isOutgoing ? `
                        <div class="message__avatar-container">
                            <img src="${message.senderAvatar}" alt="Avatar" class="avatar">
                        </div>
                        <div class="message_dialog">
                            <div class="message__author">${message.senderName}</div>
                        ` : ''}
                        <div class="message__content">${message.text}</div>
                        <div class="message__meta">
                            <div class="message__time">${new Date(message.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                            ${message.isOutgoing ? `<img src="icons/double-check.svg" alt="Read" class="message__status">` : ''}
                        </div>
                        ${!message.isOutgoing ? '</div>' : ''}
                    </div>
                </div>
            `;
        } else {
            return `
                <div class="message-container">
                    <div class="message_${message.isOutgoing ? 'my' : 'dialog'}">
                        <div class="message__content">${message.text}</div>
                        <div class="message__meta">
                            <div class="message__time">${new Date(message.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                            ${message.isOutgoing ? `<img src="icons/double-check.svg" alt="Read" class="message__status">` : ''}
                        </div>
                    </div>
                </div>
            `;
        }
    }

    renderMessage(message) {
        const messagesContainer = document.querySelector('.dialog__messages');
        if (!messagesContainer) return;

        const emptyDiv = messagesContainer.querySelector('.dialog__empty');
        if (emptyDiv) {
            messagesContainer.removeChild(emptyDiv);
        }

        messagesContainer.insertAdjacentHTML('beforeend', this.createMessageElement(message));
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    async throwMessage(text) {
        if (text && this.currentChatId) {
            try {
                const response = await sendMessage(
                    this.currentChatId, 
                    { text }
                );
                
                if (response.ok) {
                    // Сообщение добавится через WebSocket
                }
            } catch (error) {
                console.error('Error sending message:', error);
            }
        }
    }

    addListeners() {
        // // --------------- chats ----------------------

        // eventBus.on("chats -> profile", () => {
        //     this.sidebar = profile;
        //     this.render();
        // });

        // eventBus.on("chats -> contacts", () => {
        //     this.sidebar = contacts;
        //     this.render();
        // });

        // eventBus.on("chats -> new group", () => {
        //     this.sidebar = createGroup;
        //     this.render();
        // });

        // eventBus.on("chats -> new contact", () => {
        //     this.sidebar = createContact;
        //     this.render();
        // });

        // eventBus.on("chats: click on chat", () => {
        //     this.chat = group;
        //     this.render();
        // });

        // eventBus.on("new dialog", (user) => {
        //     console.log("catch new dialog", user);
        //     dialog.setUser(user);
        //     this.chat = dialog;
        //     this.render();
        // });

        // // --------------- profile -----------------------

        // eventBus.on("profile -> chats", () => {
        //     this.sidebar = chats;
        //     this.render();
        // });

        // eventBus.on("profile -> edit profile", () => {
        //     this.sidebar = editProfile;
        //     this.render();
        // });

        // eventBus.on("profile -> logout", () => {
        //     auth.logout();
        //     goToPage("login");
        // });

        // // --------------- edit profile ----------------------

        // eventBus.on("edit profile -> back", () => {
        //     this.sidebar = profile;
        //     this.render();
        // });

        // eventBus.on("edit profile -> save", () => {
        //     this.sidebar = profile;
        //     this.render();
        // });

        // // ------------------- contacts ----------------------

        // eventBus.on("contacts -> chats", () => {
        //     this.sidebar = chats;
        //     this.render();
        // });

        // // ------------------- new group ----------------------

        // eventBus.on("new group -> chats", () => {
        //     this.sidebar = chats;
        //     this.render();
        // });

        // eventBus.on("new group -> add members", () => {
        //     this.sidebar = addMembers;
        //     this.render();
        // });

        // // ----------------- add members ----------------------

        // eventBus.on("add members -> new group", () => {
        //     this.sidebar = createGroup;
        //     this.render();
        // });

        // eventBus.on("add members -> next", () => {
        //     this.sidebar = chats;
        //     this.render();
        // });

        // // ------------------- new contact ----------------------

        // eventBus.on("new contact -> chats", () => {
        //     this.sidebar = chats;
        //     this.render();
        // });

        // // ------------------- dialog -----------------------
        // eventBus.on("close dialog", () => {
        //     this.chat = noChat;
        //     this.render();
        // });

        //--------------- chats ----------------------

        eventBus.on("chats -> profile", () => {
            this.sidebar = profile;
            this.render();
        });

        eventBus.on("chats -> contacts", () => {
            this.sidebar = contacts;
            this.render();
        });

        eventBus.on("chats -> new group", () => {
            this.sidebar = createGroup;
            this.render();
        });

        eventBus.on("chats -> new contact", () => {
            this.sidebar = createContact;
            this.render();
        });

        eventBus.on("chats: click on chat", (chatId) => {
            this.currentChatId = chatId;
            this.chat = group;
            this.currentChatType = 'group';
            this.loadMessageHistory(chatId);
            this.render();
        });

        eventBus.on("new dialog", (user) => {
            dialog.setUser(user);
            this.chat = dialog;
            this.currentChatId = user.id;
            this.currentChatType = 'dialog';
            this.loadMessageHistory(user.id);
            this.render();
        });

        eventBus.on("send message", (text) => {
            this.throwMessage(text);
            this.render();
        });

        // --------------- profile -----------------------

        eventBus.on("profile -> chats", () => {
            this.sidebar = chats;
            this.render();
        });

        eventBus.on("profile -> edit profile", () => {
            this.sidebar = editProfile;
            this.render();
        });

        eventBus.on("profile -> logout", () => {
            auth.logout();
            goToPage("login");
        });

        // --------------- edit profile ----------------------

        eventBus.on("edit profile -> back", () => {
            this.sidebar = profile;
            this.render();
        });

        eventBus.on("edit profile -> save", () => {
            this.sidebar = profile;
            this.render();
        });

        // ------------------- contacts ----------------------

        eventBus.on("contacts -> chats", () => {
            this.sidebar = chats;
            this.render();
        });

        // ------------------- new group ----------------------

        eventBus.on("new group -> chats", () => {
            this.sidebar = chats;
            this.render();
        });

        eventBus.on("new group -> add members", () => {
            this.sidebar = addMembers;
            this.render();
        });

        // ----------------- add members ----------------------

        eventBus.on("add members -> new group", () => {
            this.sidebar = createGroup;
            this.render();
        });

        eventBus.on("add members -> next", () => {
            this.sidebar = chats;
            this.render();
        });

        // ------------------- new contact ----------------------

        eventBus.on("new contact -> chats", () => {
            this.sidebar = chats;
            this.render();
        });

        // ------------------- dialog -----------------------
        eventBus.on("close dialog", () => {
            this.chat = noChat;
            this.currentChatId = null;
            this.currentChatType = null;
            this.messages = [];
            this.render();
        });

    // updateListeners() {
    //     const callback = () => {
    //         group.infoIsOpen = false;
    //         this.chat = noChat;
    //         this.render();
    //     };

    //     const goToNoChat = function (event) {
    //         event.preventDefault();

    //         if (event.key === "Escape") {
    //             callback();
    //         }

    //         document.removeEventListener("keydown", goToNoChat);
    //     };

    //     if (this.chat !== noChat) {
    //         document.addEventListener("keydown", goToNoChat);
    //     }
    }

    async render() {
        // Сохраняем ссылки на текущие интерактивные элементы
        const oldContainer = document.querySelector('.container');
        const oldInput = oldContainer?.querySelector('.chat-input-container__input');
        const oldSendButton = oldContainer?.querySelector('.chat-input-container__button');
        
        // Сохраняем значения полей ввода
        const inputValue = oldInput?.value || '';

        const mainPageTemplate = Handlebars.templates["MainPage.hbs"];
        const html = mainPageTemplate({});

        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");

        const newContainer = doc.body.firstChild;

        const sidebar = this.sidebar.getHTML();
        newContainer.insertBefore(sidebar, newContainer.firstChild);
        const divider = newContainer.querySelector(".container__divider");
        const chat = this.chat.getHTML();
        divider.after(chat);

        const newInput = newContainer.querySelector('.chat-input-container__input');
        if (newInput) newInput.value = inputValue;

        // Заменяем контейнер
        const root = document.getElementById("root");
        if (oldContainer) {
            root.replaceChild(newContainer, oldContainer);
        } else {
            root.appendChild(newContainer);
        }

        // Добавляем обработчики
        this.sidebar.addListeners?.();
        this.chat.addListeners?.();
        this.addMessageInputListeners();

        return new RenderResult({});
    }
    addMessageInputListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.closest('.chat-input-container__button')) {
                const input = document.querySelector('.chat-input-container__input');
                const text = input?.value.trim();
                if (text) {
                    eventBus.emit("send message", text);
                    input.value = '';
                }
            }
            
        });

        document.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && e.target.closest('.chat-input-container__input')) {
                const input = e.target;
                const text = input.value.trim();
                if (text) {
                    eventBus.emit("send message", text);
                    input.value = '';
                }
            }
        });
    }
}

export const mainPage = new MainPage();
