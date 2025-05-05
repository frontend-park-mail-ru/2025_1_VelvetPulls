import { eventBus } from "../../../shared/modules/EventBus/EventBus.js";
import { api } from "../../../shared/api/api.js";
import { createChat } from "../../../entities/Chat/api/api.js";
import { chatWebSocket } from "../../../shared/api/websocket.js";
import { currentUser } from "../../../entities/User/model/User.js";

class CreateChannel {
    async getHTML() {
        const createGroupTemplate = Handlebars.templates["CreateChannel.hbs"];
        const html = createGroupTemplate({});

        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");

        const container = doc.body.firstChild;
        this.container = container;

        this.container = container;

        this.addListeners();

        return container;
    }

    addListeners() {
        // Назад (в чаты)
        const backButton = this.container.querySelector("#button-back");
        backButton.addEventListener("click", (event) => {
            event.preventDefault();
            eventBus.emit("new chat is created");
        });

        // Далее (добавить участников)
        const nextButton = this.container.querySelector(
            ".sidebar__fixed-button",
        );
        nextButton.addEventListener("click", async (event) => {
            event.preventDefault();

            const input = this.container.querySelector("#group-name-input");

            if (input.value === "") {
                alert("username не может быть пустым");
            } else {
                let username = input.value;

                if (username !== null) {
                    //const responseBody = await api.get(`/profile/${username}`);

                    if (true) {
                        // const chatData = {
                        //     type: "dialog",
                        //     dialog_user: username,
                        //     title: "1",
                        // };
                        const chatData = {
                            type: "channel",
                            title: username,
                        };
                        const responseBody = await createChat(chatData);
                
                        chatWebSocket.reconnect();
                
                        const chatId = responseBody.data.id;
                
                        // Добавить участников
                        const members = [];
                        //await createChat(chatData);
                        members.push(currentUser.getUsername())
                        // for (let i = 0; i < checkboxes.length; ++i) {
                        //     const checkbox = checkboxes[i];
                        //     const contact = this.contacts[i];
                
                        //     if (checkbox.checked) {
                        //         members.push(contact.username);
                        //     }
                        // }
        //                 let response = await api.get("/contacts");
        // response.data.forEach(element => {
        //     members.push(element.username)
        // });
                        // console.log(chatData,members)
                        await api.post(`/chat/${chatId}/users`, members);

                        chatWebSocket.reconnect();

                        eventBus.emit("new chat is created");
                    } else {
                        alert(
                            `Пользователь с username "${username}" не найден`,
                        );
                    }
                }
                ///eventBus.emit("new dialog",username)
                //eventBus.emit("new dialog -> chats");
            }
        });
    }
}

export const createChannel = new CreateChannel();
