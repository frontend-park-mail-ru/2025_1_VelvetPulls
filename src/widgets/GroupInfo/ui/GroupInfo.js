import { currentUser } from "../../../entities/User/model/User.js";
import { api } from "../../../shared/api/api.js";
import { eventBus } from "../../../shared/modules/EventBus/EventBus.js";
import { editGroup } from "../../EditGroup/index.js";
import { groupAddMembers } from "../../GroupAddMembers/ui/GroupAddMembers.js";

class GroupInfo {
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

        const template = Handlebars.templates["GroupInfo.hbs"];
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

        this.addListeners();

        return container;
    }

    addListeners() {
        const container = this.container;

        const buttonClose = container.querySelector("#close-chat-info");
        buttonClose.addEventListener("click", (event) => {
            event.preventDefault();

            container.parentElement.removeChild(container);
            eventBus.emit("group-info: close", {});
        });

        if (this.isOwner) {
            const buttonEdit = container.querySelector("#edit-group-button");
            buttonEdit.addEventListener(
                "click",
                this.onClickEditGroup.bind(this),
            );

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

    onGroupNewMembers(newMembers) {
        const container = this.container;

        const membersCountElement = container.querySelector(
            "#group-info__members-count",
        );

        const currentMembersCount = Number(membersCountElement.innerHTML);
        membersCountElement.innerHTML = currentMembersCount + newMembers.length;

        const members = container.querySelector("#members");

        newMembers.reverse();

        for (const member of newMembers) {
            const usernameElement = document.createElement("span");
            usernameElement.innerHTML = member;
            usernameElement.className = "detail-item__username";

            const deleteButtonElement = document.createElement("img");
            deleteButtonElement.src = "icons/delete.svg";
            deleteButtonElement.alt = "Delete";
            deleteButtonElement.className = "icon";

            const newMemberElement = document.createElement("div");
            newMemberElement.classList = "detail-item";
            newMemberElement.appendChild(usernameElement);
            newMemberElement.appendChild(deleteButtonElement);

            members.insertBefore(newMemberElement, members.firstChild);
        }
    }

    onAddMembersClick(event) {
        event.preventDefault();
        groupAddMembers.render();
    }

    async deleteMember({ username, memberElement }) {
        await api.delete(`/chat/${this.chatId}/users`, [username]);

        memberElement.parentElement.removeChild(memberElement);

        const countElement = this.container.querySelector(
            "#group-info__members-count",
        );
        const count = Number(countElement.innerHTML) - 1;
        countElement.innerHTML = count;

        eventBus.emit("group delete member");
    }
}

export const groupInfo = new GroupInfo();
