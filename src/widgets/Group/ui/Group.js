import { eventBus } from "../../../shared/modules/EventBus/EventBus.js";
import { groupInfo } from "../../GroupInfo/index.js";
import { Message } from "../../../entities/Message/model/Message.js";
import { api } from "../../../shared/api/api.js";
class Group {
    constructor() {
        this.user = null;
        this.chatId = null;
        this.messages = [];
        this.container = null;

        this.infoIsOpen = false;

        eventBus.on("group-info: close", () => {
            this.infoIsOpen = false;
        });
    }

    setID(user) {
        this.id = user;
    }
    async getData(){
        const responseBody=await api.get("/chat/"+this.id)
        this.data=responseBody.data
    }

    getHTML() {
        const data = {
            fullName: "vden5",
            avatarSrc:" this.user.avatarSrc",
            messages: this.messages,
        };

        const dialogTemplate = Handlebars.templates["Group.hbs"];
        const html = dialogTemplate();

        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");
        const container = doc.body.firstChild;
        this.container = container;
        console.log(this.data)
        doc.querySelector(".chat-header__full-name").innerHTML=this.data.title

        this.addListeners();

        return container;
    }

    addListeners() {
        // const closeButton = this.container.querySelector("#close-chat");
        //         closeButton.addEventListener(
        //             "click",
        //             this.onClickButtonClose.bind(this),
        //         );
        
                const header = this.container.querySelector(".chat-header");
                header.addEventListener("click", this.onClickChatHeader.bind(this));
        
                const sendMessageButton = this.container.querySelector(
                    "#send-message-button",
                );
                sendMessageButton.addEventListener(
                    "click",
                    this.onClickSendMessage.bind(this),
                );
            }
        
            onClickButtonClose(event) {
                event.preventDefault();
                event.stopPropagation();
        
                this.infoIsOpen = false;
                eventBus.emit("close dialog");
            }
        
            onClickChatHeader(event) {
                event.preventDefault();
                console.log("fbhdmj")
        
                if (!this.infoIsOpen) {
                    const groupInfoContainer = groupInfo.getHTML(this.data);
                    const divider = this.container.querySelector(".vertical-divider");
                    divider.after(groupInfoContainer);
                    this.infoIsOpen = true;
                }
            }
            async onClickSendMessage(event) {
                    event.preventDefault();
            
                    console.log("send message button click");
            
                    const messageInput = this.container.querySelector(
                        ".chat-input-container__input",
                    );
                    console.log("input value:", messageInput.value);
            
                    if (messageInput.value === "") {
                        alert("Сообщение не может быть пустым");
                    } else {
                        console.log("send message:", messageInput.value);
            
                        const messageData = {
                            body: messageInput.value,
                            sentAt: "12:00",
                        };
                        const message = new Message(messageData);
            
                        const messages = this.container.querySelector("#messages");
                        messages.appendChild(message.getElement("my"));
                        messages.appendChild(message.getElement("dialog"));
                    }
                }
}

export const group = new Group();
