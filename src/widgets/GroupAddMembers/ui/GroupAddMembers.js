import { eventBus } from "../../../shared/modules/EventBus/EventBus.js";
import { api } from "../../../shared/api/api.js";
import { groupInfo } from "../../GroupInfo/index.js";

class GroupAddMembers {
    constructor() {
        this.newMembers = [];

        eventBus.on("group delete member", this.onDeleteMember.bind(this));
    }

    onDeleteMember(username) {
        // Удалить участника из массива
        this.users = this.users.filter((user) => user["username"] !== username);
    }

    setData(data) {
        this.users = data.users;
        this.chatId = data.chatId;
        // this.title = data.title;
        // this.countUsers = data.countUsers;
        // this.avatarSrc = data.avatarSrc;
    }

    async render() {
        const chatContainer = document.querySelector(".chat-container");
        const sidebar = chatContainer.lastElementChild;

        const container = this.getHTML();
        chatContainer.removeChild(sidebar);
        chatContainer.appendChild(container);
    }

    getHTML() {
        const template = Handlebars.templates["GroupAddMembers.hbs"];

        const html = template({});

        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");

        const container = doc.body.firstChild;
        this.container = container;

        this.bindListeners();

        return container;
    }

    bindListeners() {
        const container = this.container;

        // Назад (информация о группе)
        const buttonBack = container.querySelector("#button-back");
        buttonBack.addEventListener("click", this.onButtonBackClik.bind(this));

        const buttonSearch = container.querySelector("#button-search");
        buttonSearch.addEventListener("click", this.onSearch.bind(this));

        const inputUsername = this.container.querySelector(
            ".sidebar-header__search-input",
        );
        inputUsername.addEventListener("keypress", (event) => {
            if (event.key === "Enter") {
                this.onSearch(event);
            }
        });
        inputUsername.addEventListener(
            "input",
            this.removeErrorIfExists.bind(this),
        );

        const buttonAdd = container.querySelector("#button-add");
        buttonAdd.addEventListener("click", this.onButtonAddClik.bind(this));
    }

    onButtonBackClik(event) {
        event.preventDefault();
        groupInfo.render();
    }

    async onSearch(event) {
        event.preventDefault();

        const container = this.container;

        const searchInput = container.querySelector(
            ".sidebar-header__search-input",
        );
        const username = searchInput.value.trim();

        for (const user of this.users) {
            if (username === user["username"]) {
                this.createErrorIfNotExists(
                    `Пользователь ${username} уже есть в группе`,
                );
                return;
            }
        }

        for (const newMember of this.newMembers) {
            if (username === newMember) {
                this.createErrorIfNotExists(
                    `Пользователь ${username} уже есть в списке добавляемых пользователей`,
                );
                return;
            }
        }

        const response = await api.get(`/profile/${username}`);

        if (response.status === false) {
            this.createErrorIfNotExists(`Пользоватль ${username} не найден`);
            return;
        }

        this.showNewMember(username);
        searchInput.value = "";

        this.newMembers.push(username);
    }

    createErrorIfNotExists(textError) {
        const errorElement = document.createElement("div");
        errorElement.innerHTML = textError;
        errorElement.classList.add("error-label");

        const container = this.container;
        const sidebarList = container.querySelector(".sidebar-list");
        const firstChild = sidebarList.firstChild;

        if (firstChild.classList === undefined) {
            sidebarList.firstChild.before(errorElement);
        }
    }

    removeErrorIfExists() {
        const container = this.container;
        const sidebarList = container.querySelector(".sidebar-list");
        const firstChild = sidebarList.firstChild;

        if (
            firstChild.classList !== undefined &&
            firstChild.classList.contains("error-label")
        ) {
            sidebarList.removeChild(firstChild);
        }
    }

    showNewMember(username) {
        const container = this.container;

        const usernameElement = document.createElement("span");
        usernameElement.innerHTML = username;

        const deleteButtonElement = document.createElement("img");
        deleteButtonElement.src = "icons/delete.svg";
        deleteButtonElement.alt = "Delete";
        deleteButtonElement.className = "icon";

        const newMemberElement = document.createElement("div");
        newMemberElement.classList = "detail-item";
        newMemberElement.appendChild(usernameElement);
        newMemberElement.appendChild(deleteButtonElement);

        const membersElement = container.querySelector(".sidebar-list");
        membersElement.appendChild(newMemberElement);

        deleteButtonElement.addEventListener("click", (event) => {
            event.preventDefault();
            this.newMembers = this.newMembers.filter(
                (member) => member !== username,
            );
            membersElement.removeChild(newMemberElement);
        });
    }

    async onButtonAddClik(event) {
        event.preventDefault();

        if (this.newMembers.length === 0) {
            return;
        }

        await api.post(`/chat/${this.chatId}/users`, this.newMembers);

        await groupInfo.onGroupNewMembers();

        eventBus.emit("group new members", this.newMembers);

        groupInfo.render();

        this.newMembers = [];
    }
}

export const groupAddMembers = new GroupAddMembers();
