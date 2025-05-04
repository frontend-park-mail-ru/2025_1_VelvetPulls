import { currentUser } from "../../../entities/User/model/User.js";
import { api } from "../../../shared/api/api.js";
import { eventBus } from "../../../shared/modules/EventBus/EventBus.js";
import { editGroup } from "../../EditGroup/index.js";
import { groupAddMembers } from "../../GroupAddMembers/ui/GroupAddMembers.js";
import { mainPage } from "../../../pages/MainPage/MainPage.js";

class ChannelInfo {
    constructor() {
        eventBus.on("group is edited", this.onGroupEdit.bind(this));
        eventBus.on("group new members", this.onGroupNewMembers.bind(this));
    }

    setData(data) {
        this.chatId = data.chatId;
        this.title = data.title;
        this.countUsers = data.countUsers;
        this.avatarSrc = data.avatarSrc;
        this.users = data.users;

        this.isOwner = false;
        for (const user of data.users) {
            if (
                user.role === "owner" &&
                user.username === currentUser.getUsername()
            ) {
                this.isOwner = true;
                break;
            }
        }

        editGroup.setData(data);
        groupAddMembers.setData(data);
    }

    render() {
        const chatContainer = document.querySelector(".chat-container");
        const sidebar = chatContainer.lastElementChild;

        const container = this.getHTML();
        if (sidebar.classList.contains("sidebar")) {
            chatContainer.removeChild(sidebar);
        }
        chatContainer.appendChild(container);
    }

    getHTML() {
        Handlebars.registerHelper("eq", (a, b) => a == b);

        const context = {
            avatarSrc: this.avatarSrc,
            title: this.title,
            members: this.users,
            membersCount: this.countUsers,
            isOwner: this.isOwner,
        };

        const template = Handlebars.templates["ChannelInfo.hbs"];
        const html = template({ ...context });

        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");
        const container = doc.body.firstChild;
        this.container = container;

        if (this.isOwner) {
            const membersElement = container.querySelectorAll(".member");

            for (const memberElement of membersElement) {
                const username = memberElement.querySelector(
                    ".detail-item__username",
                ).innerHTML;

                if (username !== currentUser.getUsername()) {
                    const deleteButtonElement = document.createElement("img");
                    deleteButtonElement.src = "icons/delete.svg";
                    deleteButtonElement.alt = "Delete";
                    deleteButtonElement.className = "icon";

                    deleteButtonElement.addEventListener(
                        "click",
                        async (event) => {
                            event.preventDefault();
                            await this.deleteMember({
                                username,
                                memberElement,
                            });
                        },
                    );

                    memberElement.appendChild(deleteButtonElement);
                }
            }
        }
        this.inputUser=this.container.querySelector("#username-input")

        this.addListeners();


        return container;
    }

    addListeners() {
        const container = this.container;

        const buttonClose = container.querySelector("#close-chat-info");
        buttonClose.addEventListener("click", (event) => {
            event.preventDefault();

            container.parentElement.removeChild(container);
            if (mainPage.mobile){
                                        document.querySelector(".chat-container").querySelector(".chat").style.visibility="visible"
                                    document.querySelector(".chat-container").querySelector(".chat").style.width="320px"
                                    }
            eventBus.emit("group-info: close", {});
        });

        if (this.isOwner) {
            const buttonEdit = container.querySelector("#edit-group-button");
            buttonEdit.addEventListener(
                "click",
                this.onClickEditGroup.bind(this),
            );

            this.inputUser.addEventListener("keypress", async (event) => {
            if (event.key === "Enter") {
                let members=[]
                members.push(this.inputUser.value)
                // console.log(this.chatId,members)
        const response = await api.post(`/chat/${this.chatId}/users`, members);
        if (response.data.not_added_users!==undefined){
            alert("Такого пользователя не существует")
        } else {
        let a1=document.querySelector("#group-header__count-members").innerHTML
        let a2=document.querySelector("#group-info__members-count").innerHTML
        let a3=document.querySelector("#members").innerHTML+=`<div class="detail-item member">
        <span class="detail-item__username">${this.inputUser.value}</span>
            <span>new user!</span>
    </div>`
    document.querySelector("#group-header__count-members").innerHTML=Number(a1)+1
    document.querySelector("#group-info__members-count").innerHTML=Number(a2)+1
        // console.log(a1,a2,a3)
            }}
        });

            const addMembersButton = container.querySelector(
                "#add-members-button",
            );
            addMembersButton.addEventListener(
                "click",
                this.onAddMembersClick.bind(this),
            );
        }
    }

    onClickEditGroup(event) {
        event.preventDefault();
        editGroup.render();
    }

    onGroupEdit(data) {
        this.title = data.title;
        this.avatarSrc = data.avatarSrc;

        const container = this.container;

        const title = container.querySelector(".user-info__full-name");
        title.innerHTML = this.title;

        const avatar = container.querySelector(".avatar-container__image");
        avatar.src = this.avatarSrc;
    }

    async onGroupNewMembers() {
        const response = await api.get(`/chat/${this.chatId}`);

        this.users = response["data"]["users"];
        this.countUsers = this.users.length;
    }

    onAddMembersClick(event) {
        event.preventDefault();
        this.inputUser.style.visibility="visible"
        //groupAddMembers.render();
    }

    async deleteMember({ username, memberElement }) {
        await api.delete(`/chat/${this.chatId}/users`, [username]);

        memberElement.parentElement.removeChild(memberElement);

        const countElement = this.container.querySelector(
            "#group-info__members-count",
        );
        const count = Number(countElement.innerHTML) - 1;
        countElement.innerHTML = count;

        // Удалить участника из массива
        this.users = this.users.filter((user) => user["username"] !== username);
        // console.log(this.chatId)
        let a1=document.querySelector("#group-header__count-members").innerHTML
        document.querySelector("#group-header__count-members").innerHTML=Number(a1)-1
    }
}

export const channelInfo = new ChannelInfo();
