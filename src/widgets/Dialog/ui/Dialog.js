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
        this.messages1 = [];
        this.container = null;
        this.topMsgs=[]
        this.curMsgs=[]
        this.botMsgs=[]

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
        this.messages1=(await getMessageHistory(chatId)).data;

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

        let queue=this.messages
        let curMes=[]
        let prevMes=[]
        if (queue===undefined){
            queue=[]
        }
        //queue=queue.reverse()
        const messages = this.container.querySelector("#messages");
        if (this.messages !== null) {

            for (let i=0;(i<8)&&(queue.length>0);i++){
                let a=queue.pop()
                curMes.push(a)
                const message = new Message(a);
                if (a.user === currentUser.getUsername()) {
                    messages.insertBefore(await message.getElement("my"),messages.firstChild)

                } else {
                    messages.insertBefore(await message.getElement("dialog"),messages.firstChild)
                }
            }
        }
        let m=this.messages
        this.topMsgs=[]
        this.curMsgs=[]
        this.botMsgs=[]
        const handleScroll = async () => {
        // async function handleScroll() {
            // console.log(messages.clientHeight,messages.scrollTop,messages.scrollHeight)
            if ((messages.scrollTop===0)&&(queue.length>0)){
                let a=queue.pop()
                curMes.push(a)
                const message = new Message(a);
                if (a.user === currentUser.getUsername()) {
                    messages.insertBefore(await message.getElement("my"),messages.firstChild)
                } else {
                    messages.insertBefore(await message.getElement("dialog"),messages.firstChild)
                }
                messages.removeChild(messages.lastElementChild)
                let b=curMes.shift()
                prevMes.push(b)
                console.log(prevMes,curMes,queue)
                this.topMsgs=queue
                this.curMsgs=curMes
                this.botMsgs=prevMes
                messages.scrollTop=10
            }
            if ((messages.clientHeight+messages.scrollTop+5>messages.scrollHeight)&&(prevMes.length>0)){
                let a=prevMes.pop()
                //console.log(a,queue.pop())
                curMes.unshift(a)
                const message = new Message(a);
                if (a.user === currentUser.getUsername()) {
                    messages.appendChild(await message.getElement("my"))
                } else {
                    messages.appendChild(await message.getElement("dialog"))
                }
                messages.removeChild(messages.firstChild)
                // let b=curMes.pop()
                // queue.unshift(b)
                let b=curMes.pop()
                queue.push(b)
                this.topMsgs=queue
                this.curMsgs=curMes
                this.botMsgs=prevMes
                console.log(curMes)
            }
            // if (scrollTop + windowHeight >= documentHeight - 100) { // Загружаем, если осталось 100px до конца
            //     // loadItems();
            // }
        }
    
        messages.addEventListener('scroll', handleScroll);
        const search=doc.querySelector(".sidebar-header__search-input")
        const search_res=doc.querySelector("#search_msgs_res")
        search.addEventListener('keypress', async function(event) {
            if (event.key === 'Enter') {
                // console.log(search.value,ch_id)
                const responseBody1 = await api.get(`/search/${ch_id}/messages?query=${search.value}&limit=10`);
                console.log(responseBody1.data.messages)
                let res=responseBody1.data.messages
                search_res.style.visibility="visible"
                search_res.style.height="150px"
                document.querySelector("#messages").style.height="100%"
                search_res.innerHTML=""
                if (res!==null){
                    for (let i=0;i<res.length;i++){
                        const sentAt = new Date(res[i].sent_at)
                        search_res.innerHTML+=`<p>${res[i].username} в ${sentAt.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                        })} отправил: ${res[i].body}</p>`
                    }
                }
            }
        })

        search_res.addEventListener("click", (event) => {
            event.preventDefault();
            search_res.style.visibility="hidden"
            search_res.style.height="0px"
        });

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
                        document.querySelector(".chat-container").querySelector(".sidebar").style.width="100%"
                        }
        }
    }

    async sendMessage(event) {
        event.preventDefault();

        const messageInput = this.container.querySelector(
            ".chat-input-container__input",
        );
        const messages = this.container.querySelector("#messages");
        if ((messageInput.value !== "")&&((messageInput.value.split(' ').length-1)!==messageInput.value.length)) {
            while (this.botMsgs.length>0){
                let a=this.botMsgs.pop()

                this.curMsgs.unshift(a)
                const message = new Message(a);
                if (a.user === currentUser.getUsername()) {
                    messages.appendChild(await message.getElement("my"))
                } else {
                    messages.appendChild(await message.getElement("dialog"))
                }
                //messages.removeChild(messages.firstChild)
                // let b=curMes.pop()
                // queue.unshift(b)
                //let b=this.curMsgs.pop()
                //this.topMsgs.push(b)

                console.log(a)
            }
            await sendMessage(this.chatId, messageInput.value);
            // messages.removeChild(messages.lastElementChild)
            console.log(this.messages1)

            const messageData = {
                body: messageInput.value,
                sent_at: new Date(),
                // user: currentUser.getUsername(),
                user: store.profile["username"],
            };
            const message = new Message(messageData);

            chatWebSocket.send(message);

            messageInput.value = "";
            console.log(this.messages)
            // document.querySelector("#messages").innerHTML = ""
        }
    }
}

export const dialogInstace = new Dialog();
