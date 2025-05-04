import { api } from "../../../shared/api/api.js";
import { eventBus } from "../../../shared/modules/EventBus/EventBus.js";
import { Message } from "../../../entities/Message/index.js";
import {
    sendMessage,
    getMessageHistory,
} from "../../../entities/Message/index.js";
import { currentUser } from "../../../entities/User/model/User.js";
import { chatWebSocket } from "../../../shared/api/websocket.js";
import { groupInfo } from "../../GroupInfo/index.js";
import { getAvatar } from "../../../shared/helpers/getAvatar.js";
import { channelInfo } from "../../ChannelInfo/index.js";
import { store } from "../../../app/store/index.js";
import { mainPage } from "../../../pages/MainPage/MainPage.js";

class Channel {
    constructor() {
        this.infoIsOpen = false;

        eventBus.on("group-info: close", () => {
            this.infoIsOpen = false;
        });

        eventBus.on("group is edited", this.onGroupEdit.bind(this));
        eventBus.on("group new members", this.onNewMembers.bind(this));
        eventBus.on("group delete member", this.onDeleteMember.bind(this));
        eventBus.on("open dialog", () => {
            this.infoIsOpen = false;
        });
        eventBus.on("close channel info", () => {
            //event.preventDefault();

        //if (!this.infoIsOpen) {
            channelInfo.render();
            this.infoIsOpen = true;
        //}
        });
    }

    async setData(chatId) {
        const responseBody = await api.get(`/chat/${chatId}`);
        const responseData = responseBody["data"];
        //console.log(responseData.users)
        responseData.users.forEach(element => {
            if (element.role==="owner"){
                this.owner=element
            }
        });
        // console.log(this.owner)
        //this.owner=responseData.users[responseData.users.length-1]

        const avatarPath = responseData["avatar_path"];

        this.chatId = responseData["id"];
        this.title = responseData["title"];
        this.countUsers = responseData["count_users"];
        this.avatarSrc = await getAvatar(avatarPath);

        this.messages = (await getMessageHistory(chatId)).data;

        const data = {
            chatId: this.chatId,
            title: this.title,
            countUsers: this.countUsers,
            avatarSrc: this.avatarSrc,
            users: responseData["users"],
        };

        groupInfo.setData(data);
        channelInfo.setData(data)
    }

    async getHTML() {
        const data = {
            title: this.title,
            countUsers: this.countUsers,
            avatarSrc: this.avatarSrc,
        };

        const groupTemplate = Handlebars.templates["Channel.hbs"];
        const html = groupTemplate({ ...data });

        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");
        const container = doc.body.firstChild;
        this.container = container;

        const messages = this.container.querySelector("#messages");
        if (this.messages !== null) {
            for (const messageItem of this.messages) {
                const message = new Message(messageItem);

                if (messageItem.user === currentUser.getUsername()) {
                    messages.appendChild(await message.getElement("my"));
                } else {
                    messages.appendChild(await message.getElement("channel"));
                }

                messages.scrollTop = messages.scrollHeight;
            }
        }

        const search=doc.querySelector(".sidebar-header__search-input")
        const ch_id=this.chatId
        const search_res=doc.querySelector("#search_msgs_res")
        search.addEventListener('keypress', async function(event) {
            if (event.key === 'Enter') {
                // console.log(search.value,ch_id)
                const responseBody1 = await api.get(`/search/${ch_id}/messages?query=${search.value}&limit=10`);
                // console.log(responseBody1.data.messages)
                let res=responseBody1.data.messages
                search_res.style.visibility="visible"
                search_res.innerHTML=""
                if (res!==null){
                    for (let i=0;i<res.length;i++){
                        search_res.innerHTML+=`<p>${res[i].username} отправил: ${res[i].body}</p>`
                    }
                }
            }
        })

        this.bindListeners();

        // console.log(currentUser.getUsername(), this.owner.username)

        if (currentUser.getUsername()!==this.owner.username){
        container.querySelector(".chat-input-container").innerHTML="<p>Ты всего лишь подписота, только смотреть можно</p>"
        }

        // container.querySelector(".chat-input-container").innerHTML=""

        return container;
    }

    bindListeners() {
        const closeButton = this.container.querySelector("#close-chat");
        closeButton.addEventListener(
            "click",
            this.onClickButtonClose.bind(this),
        );

        const header = this.container.querySelector(".chat-header");
        header.addEventListener("click", this.onClickChatHeader.bind(this));

        const sendMessageButton = this.container.querySelector(
            "#send-message-button",
        );
        sendMessageButton.addEventListener(
            "click",
            this.onClickSendMessage.bind(this),
        );
        const inputMessage = this.container.querySelector(
            "#send-message-input",
        );
        inputMessage.addEventListener("keypress", (event) => {
            if (event.key === "Enter") {
                this.onClickSendMessage(event);
            }
        });
    }

    onClickButtonClose(event) {
        event.preventDefault();
        event.stopPropagation();

        this.infoIsOpen = false;
        eventBus.emit("close dialog");
    }

    onClickChatHeader(event) {
        event.preventDefault();

        if (!this.infoIsOpen) {
            channelInfo.render();
            this.infoIsOpen = true;
            if (mainPage.mobile) {
                            document.querySelector(".chat-container").querySelector(".chat").style.visibility="hidden"
                        document.querySelector(".chat-container").querySelector(".chat").style.width="0px"
                        document.querySelector(".chat-container").querySelector(".sidebar").style.width="100%"
                        }
        }
    }

    async onClickSendMessage(event) {
        event.preventDefault();

        const messageInput = this.container.querySelector(
            ".chat-input-container__input",
        );

        if (messageInput.value !== "" &&((messageInput.value.split(' ').length-1)!==messageInput.value.length)) {
            await sendMessage(this.chatId, messageInput.value);

            const messageData = {
                body: messageInput.value,
                sent_at: new Date(),
            };
            const message = new Message(messageData);

            messageInput.value = "";

            chatWebSocket.send(message);
        }
    }

    onGroupEdit(data) {
        this.title = data.title;
        this.avatarSrc = data.avatarSrc;

        const container = this.container;

        const title = container.querySelector(".chat-header__full-name");
        title.innerHTML = this.title;

        const avatar = container.querySelector(".chat-header__avatar");
        avatar.src = this.avatarSrc;
    }

    onNewMembers(newMembers) {
        const container = this.container;

        const membersCountElement = container.querySelector(
            "#group-header__count-members",
        );
        const currentMembersCount = Number(membersCountElement.innerHTML);
        membersCountElement.innerHTML = currentMembersCount + newMembers.length;
    }

    onDeleteMember() {
        const countElement = this.container.querySelector(
            "#group-header__count-members",
        );
        const count = Number(countElement.innerHTML) - 1;
        countElement.innerHTML = count;
    }
}

export const channelInstance = new Channel();
