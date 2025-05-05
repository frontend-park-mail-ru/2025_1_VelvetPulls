import { RenderResult } from "../../shared/helpers/RenderResponse.js";

import { addMembers } from "../../widgets/AddMembers/index.js";
import { chats } from "../../widgets/Chats/index.js";
import { contacts } from "../../widgets/Contacts/index.js";
import { createGroup } from "../../widgets/CreateGroup/index.js";
import { createContact } from "../../widgets/CreateContact/index.js";

import { profile } from "../../widgets/Profile/index.js";
import { editProfile } from "../../widgets/EditProfile/index.js";

import { noChat } from "../../widgets/NoChat/index.js";
import { dialogInstace } from "../../widgets/Dialog/index.js";
import { groupInstance } from "../../widgets/Group/index.js";
import { channelInstance } from "../../widgets/Channel/index.js";

import { eventBus } from "../../shared/modules/EventBus/EventBus.js";
import { goToPage } from "../../shared/helpers/goToPage.js";

import { createDialog } from "../../widgets/CreateDialog/index.js";
import { createChannel } from "../../widgets/CreateChannel/index.js";
import { store } from "../../app/store/index.js";

class MainPage {
    constructor() {
        this.mobile=window.innerWidth<=768
        this.sidebar = chats;
        this.chat = noChat;
        this.currentChatId = null;
        this.currentChatType = null;
        this.lastMes="";

        this.addListeners();
    }

    addListeners() {
        eventBus.on("logout", () => {
            this.sidebar = chats;
            this.chat = noChat;
            this.currentChatId = null;
            this.currentChatType = null;
        });

        eventBus.on("store: ready", () => {
            this.sidebar = chats;
            this.chat = noChat;
            this.currentChatId = null;
            this.currentChatType = null;

            this.render();
        });

        eventBus.on("store: chats updated", () => {
            if (this.sidebar === chats) {
                this.render();
            }
        });

        // --------------- chats ----------------------

        eventBus.on("ws:NEW_MESSAGE", async (message) => {
            if ((message.chatId === this.currentChatId)&&(message.id!==this.lastMes)) {
                await this.handleNewMessage(message);
            }
            this.lastMes=message.id
        });
        eventBus.on("ws:MESSAGE_UPDATED", (updatedMessage) => {
            if (updatedMessage.chatId !== this.currentChatId) return;

            const messagesContainer = document.querySelector("#messages");
            if (!messagesContainer) return;

            // Ищем сообщение по data-атрибуту
            const messageElement = messagesContainer.querySelector(
                `[data-message-id="${updatedMessage.id}"]`
            );
            if (messageElement) {
                const content = messageElement.querySelector('.message__content');
                if (content) {
                    content.textContent = updatedMessage.body;
                    if (updatedMessage.is_redacted) {
                        if (!content.querySelector('.edited-mark')) {
                            const editedMark = document.createElement('span');
                            editedMark.className = 'edited-mark';
                            editedMark.textContent = ' (edited)';
                            content.appendChild(editedMark);
                        }
                    }
                }
            }
        });

        eventBus.on("ws:MESSAGE_DELETED", (messageId) => {
            const messagesContainer = document.querySelector("#messages");
            if (!messagesContainer) return;

            const messageElement = messagesContainer.querySelector(
                `[data-message-id="${messageId}"]`
            );
            if (messageElement) {
                messageElement.classList.add('deleting');
                setTimeout(() => messageElement.remove(), 300);
            }
        });

        eventBus.on("new dialog", (user) => {
            dialogInstace.setUser(user);
            this.chat = dialogInstace;
            this.currentChatType = "dialog";
            goToPage("main");
        });

        eventBus.on("chat is deleted", (chat) => {
            if (chat["id"] === this.currentChatId) {
                this.currentChatId = null;
                this.currentChatType = null;
                this.chat = noChat;
            }
            goToPage("main");
        });

        eventBus.on("new chat is created", () => {
            this.sidebar = chats;
            goToPage("main");
        });

        eventBus.on("open dialog", async ({ user, chatId }) => {
            this.currentChatId = chatId;
            this.currentChatType = "dialog";
            await dialogInstace.init({ user, chatId });
            this.chat = dialogInstace;

            goToPage("main");
        });

        eventBus.on("open group", async (chatId) => {
            this.currentChatId = chatId;
            this.currentChatType = "group";

            await groupInstance.setData(chatId);
            this.chat = groupInstance;

            goToPage("main");
        });

        eventBus.on("open channel", async (chatId) => {
            this.currentChatId = chatId;
            this.currentChatType = "channel";
            await channelInstance.setData(chatId);
            this.chat = channelInstance;
            goToPage("main");
        });

        eventBus.on("chats -> profile", () => {
            this.sidebar = profile;
            this.chat = noChat;
            goToPage("main");
            if((this.currentChatId!==null)&&(document.getElementById(this.currentChatId)!==null)){
                document.getElementById(this.currentChatId).style.backgroundColor="grey"
            }
        });

        eventBus.on("chats -> contacts", () => {
            this.sidebar = contacts;
            this.chat = noChat;
            goToPage("main");
            if((this.currentChatId!==null)&&(document.getElementById(this.currentChatId)!==null)){
                document.getElementById(this.currentChatId).style.backgroundColor="grey"
            }
        });

        eventBus.on("chats -> new group", () => {
            this.sidebar = createGroup;
            this.chat = noChat;
            goToPage("main");
            if((this.currentChatId!==null)&&(document.getElementById(this.currentChatId)!==null)){
                document.getElementById(this.currentChatId).style.backgroundColor="grey"
            }
        });

        eventBus.on("chats -> new channel", () => {
            this.sidebar = createChannel;
            this.chat = noChat;
            goToPage("main");
            if((this.currentChatId!==null)&&(document.getElementById(this.currentChatId)!==null)){
                document.getElementById(this.currentChatId).style.backgroundColor="grey"
            }
        });

        eventBus.on("chats -> new dialog", () => {
            this.sidebar = createDialog;
            this.chat = noChat;
            goToPage("main");
            if((this.currentChatId!==null)&&(document.getElementById(this.currentChatId)!==null)){
                document.getElementById(this.currentChatId).style.backgroundColor="grey"
            }
        });

        eventBus.on("chats -> new contact", () => {
            this.sidebar = createContact;
            this.chat = noChat;
            goToPage("main");
            if((this.currentChatId!==null)&&(document.getElementById(this.currentChatId)!==null)){
                document.getElementById(this.currentChatId).style.backgroundColor="grey"
            }
        });

        eventBus.on("new dialog", (user) => {
            dialogInstace.setUser(user);
            this.chat = dialogInstace;
            goToPage("main");
        });

        // --------------- profile -----------------------

        eventBus.on("profile -> chats", () => {
            this.sidebar = chats;
            goToPage("main");
        });

        eventBus.on("profile -> edit profile", () => {
            this.sidebar = editProfile;
            goToPage("main");
        });

        eventBus.on("logout", () => {
            // auth.logout();
            goToPage("login");
            this.sidebar = chats;
            this.chat = noChat;
            this.currentChatId = null;
            this.currentChatType = null;
        });

        // --------------- edit profile ----------------------

        eventBus.on("edit profile -> back", () => {
            this.sidebar = profile;
            goToPage("main");
        });

        eventBus.on("edit profile -> save", () => {
            this.sidebar = profile;
            goToPage("main");
        });

        eventBus.on("store: profile updated", () => {
            this.sidebar = profile;
            goToPage("main");
        });

        // ------------------- contacts ----------------------

        eventBus.on("store: contacts updated", () => {
            this.sidebar = contacts;
            goToPage("main");
        });

        eventBus.on("contacts -> chats", () => {
            this.sidebar = chats;
            goToPage("main");
        });

        // ------------------- new group ----------------------

        eventBus.on("new group -> chats", () => {
            this.sidebar = chats;
            goToPage("main");
        });

        eventBus.on("new group -> add members", (groupInfo) => {
            addMembers.setGroupInfo(groupInfo);
            this.sidebar = addMembers;
            goToPage("main");
        });

        // ----------------- add members ----------------------

        eventBus.on("add members -> new group", () => {
            this.sidebar = createGroup;
            goToPage("main");
        });

        eventBus.on("add members -> next", () => {
            this.sidebar = chats;
            goToPage("main");
        });

        // ------------------- new contact ----------------------

        eventBus.on("new contact -> chats", () => {
            this.sidebar = chats;
            goToPage("main");
        });

        // ------------------- dialog -----------------------

        eventBus.on("close dialog", () => {
            this.chat = noChat;
            this.currentChatId=null;
            this.currentChatType = null;
            goToPage("main");
        });
    }
    async handleNewMessage(message) {
        const messagesContainer = document.querySelector("#messages");
        if (messagesContainer) {
            let messageType = null;
            // if (message.username === currentUser.getUsername()) {
            if (message.username === store.profile["username"]) {
                messageType = "my";
            } else {
                messageType = this.currentChatType;
            }
            const messageElement = await message.getElement(messageType);
            messagesContainer.appendChild(messageElement);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    }

    

    async render() {
        const mainPageTemplate = Handlebars.templates["MainPage.hbs"];
        const html = mainPageTemplate({});

        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");
        const container = doc.body.firstChild;

        const sidebar = await this.sidebar.getHTML();
        container.insertBefore(sidebar, container.firstChild);

        const divider = container.querySelector(".container__divider");
        const chat = await this.chat.getHTML();
        divider.after(chat);

        const root = document.getElementById("root");
        root.innerHTML = "";
        root.appendChild(container);

        if (document.querySelector("#messages")!==null){
            document.querySelector("#messages").scrollTop=document.querySelector("#messages").scrollHeight
        }

        if((this.currentChatId!==null)&&(document.getElementById(this.currentChatId)!==null)){
            document.getElementById(this.currentChatId).style.backgroundColor="green"
        }

        if (this.mobile){
            if(this.chat===noChat){
                    document.querySelector(".sidebar").style["min-width"]="100%"
                document.querySelector(".sidebar").style["max-width"]="100%"
            } else {
                    document.querySelector(".sidebar").style["min-width"]="0%"
                document.querySelector(".sidebar").style["max-width"]="0%"
                document.querySelector(".sidebar").style.visibility="hidden"
            }    
        } else {
            document.querySelector(".sidebar").style["min-width"]="430px"
            document.querySelector(".sidebar").style["max-width"]="430px"
        }

        return new RenderResult({});
    }
}

export const mainPage = new MainPage();
