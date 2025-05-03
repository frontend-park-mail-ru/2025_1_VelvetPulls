import { dialogInfo } from "../../DialogInfo/index.js";
import { eventBus } from "../../../shared/modules/EventBus/EventBus.js";
import { Message } from "../../../entities/Message/model/Message.js";
import {
    getMessageHistory,
    sendMessage,
} from "../../../entities/Message/index.js";
import { currentUser } from "../../../entities/User/model/User.js";
import { chatWebSocket } from "../../../shared/api/websocket.js";

import { api } from "../../../shared/api/api.js";

import { store } from "../../../app/store/index.js";
import { mainPage } from "../../../pages/MainPage/MainPage.js";


class Dialog {
    constructor() {
        this.user = null;
        this.chatId = null;
        this.messages = [];
        this.container = null;

        this.infoIsOpen = false;

        eventBus.on("close dialog info", () => {
            this.infoIsOpen = false;
        });

        eventBus.on("open group", () => {
            this.infoIsOpen = false;
        });
    }

    async init({ user, chatId }) {
        this.chatId = chatId;
        this.user = user;

        this.messages = (await getMessageHistory(chatId)).data;

        dialogInfo.setUser(user);
    }

    async getHTML() {
        const data = {
            fullName: this.user.getFullName(),
            avatarSrc: this.user.avatarSrc,
            messages: this.messages,
        };
        const ch_id=this.chatId

        const dialogTemplate = Handlebars.templates["Dialog.hbs"];
        const html = dialogTemplate({ ...data });

        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");
        const container = doc.body.firstChild;
        this.container = container;

        // const messages = this.container.querySelector("#messages");
        // if (this.messages !== null) {
        //     for (const messageItem of this.messages) {
        //         const message = new Message(messageItem);

        //         if (messageItem.user === currentUser.getUsername()) {
        //             messages.appendChild(await message.getElement("my"));
        //         } else {
        //             messages.appendChild(await message.getElement("dialog"));
        //         }

        //         messages.scrollTop = messages.scrollHeight;
        //     }
        // }
        let queue=this.messages
        if (queue===undefined){
            queue=[]
        }
        //queue=queue.reverse()
        const messages = this.container.querySelector("#messages");
        if (this.messages !== null) {

            for (let i=0;(i<8)&&(queue.length>0);i++){
                let a=queue.pop()
                const message = new Message(a);
                if (a.user === currentUser.getUsername()) {
                    messages.insertBefore(await message.getElement("my"),messages.firstChild)

                } else {
                    messages.insertBefore(await message.getElement("dialog"),messages.firstChild)
                }
                // if (a.user === currentUser.getUsername()) {
                //     messages.appendChild(await message.getElement("my"));
                // } else {
                //     messages.appendChild(await message.getElement("dialog"));
                // }
            }
            // for (const messageItem of this.messages) {
            //     const message = new Message(messageItem);

            //     if (messageItem.user === currentUser.getUsername()) {
            //         messages.appendChild(await message.getElement("my"));
            //     } else {
            //         messages.appendChild(await message.getElement("dialog"));
            //     }

            //     messages.scrollTop = messages.scrollHeight;
            // }
        }
    //     const newElement = doc.createElement('p');
    // newElement.textContent = 'Новый элемент в начале';

    // messages.insertBefore(newElement, messages.firstChild);
        let m=this.messages
        async function handleScroll() {
            // const scrollTop = messages.scrollY || messages.pageYOffset;
            // const windowHeight = messages.innerHeight;
            //const documentHeight = messages.documentElement.scrollHeight;
            //console.log(messages.scrollHeight,messages.scrollTop,m)
            if ((messages.scrollTop===0)&&(queue.length>0)){
                let a=queue.pop()
                const message = new Message(a);
                if (a.user === currentUser.getUsername()) {
                    messages.insertBefore(await message.getElement("my"),messages.firstChild)
                } else {
                    messages.insertBefore(await message.getElement("dialog"),messages.firstChild)
                }
                // console.log(queue)
                // console.log(messages)
                messages.scrollTop=100
            }
            // if (scrollTop + windowHeight >= documentHeight - 100) { // Загружаем, если осталось 100px до конца
            //     // loadItems();
            // }
        }
    
        messages.addEventListener('scroll', handleScroll);
        //console.log(messages)
        // console.log(this.messages)


        const search=doc.querySelector(".sidebar-header__search-input")
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

        //
        this.bindListeners();

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
            this.sendMessage.bind(this),
        );

        const inputMessage = this.container.querySelector(
            "#send-message-input",
        );
        inputMessage.addEventListener("keypress", (event) => {
            if (event.key === "Enter") {
                this.sendMessage(event);
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
            const groupInfoContainer = dialogInfo.getHTML();
            const divider = this.container.querySelector(".vertical-divider");
            divider.after(groupInfoContainer);
            this.infoIsOpen = true;
            if (mainPage.mobile){
                            document.querySelector(".chat-container").querySelector(".chat").style.visibility="hidden"
                        document.querySelector(".chat-container").querySelector(".chat").style.width="0px"
                        document.querySelector(".chat-container").querySelector(".sidebar").style.width="320px"
                        }
        }
    }

    async sendMessage(event) {
        event.preventDefault();

        const messageInput = this.container.querySelector(
            ".chat-input-container__input",
        );

        if ((messageInput.value !== "")&&((messageInput.value.split(' ').length-1)!==messageInput.value.length)) {
            await sendMessage(this.chatId, messageInput.value);

            const messageData = {
                body: messageInput.value,
                sent_at: new Date(),
                // user: currentUser.getUsername(),
                user: store.profile["username"],
            };
            const message = new Message(messageData);

            chatWebSocket.send(message);

            messageInput.value = "";
        }
    }
}

export const dialogInstace = new Dialog();
