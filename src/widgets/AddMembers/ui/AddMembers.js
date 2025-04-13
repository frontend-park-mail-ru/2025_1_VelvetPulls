import { eventBus } from "../../../shared/modules/EventBus/EventBus.js";
import { chatsapi } from "../../../shared/api/chats.js";
import { createGroup } from "../../CreateGroup/index.js";
class AddMembers {
    getData() {
        // Моковый запрос в БД положит данные в this.data
        this.data = [
            {
                username: "lolkekchebureck",
                fullname: "Cameron",
                photoURL: "img/Avatar.png",
                onlineStatus: "В сети",
            },
            {
                username: "lolkekchebureck",
                fullname: "Cameron Williamson",
                photoURL: "img/Avatar.png",
                onlineStatus: "В сети",
            },
            {
                username: "lolkekchebureck",
                fullname: "Cameron Williamson",
                photoURL: "img/Avatar.png",
                onlineStatus: "В сети",
            },
            {
                username: "lolkekchebureck",
                fullname: "Cameron Williamson",
                photoURL: "img/Avatar.png",
                onlineStatus: "В сети",
            },
            {
                username: "lolkekchebureck",
                fullname: "Cameron Williamson",
                photoURL: "img/Avatar.png",
                onlineStatus: "В сети",
            },
            {
                username: "lolkekchebureck",
                fullname: "Cameron Williamson",
                photoURL: "img/Avatar.png",
                onlineStatus: "В сети",
            },
            {
                username: "lolkekchebureck",
                fullname: "Cameron Williamson",
                photoURL: "img/Avatar.png",
                onlineStatus: "В сети",
            },
            {
                username: "lolkekchebureck",
                fullname: "Cameron Williamson",
                photoURL: "img/Avatar.png",
                onlineStatus: "В сети",
            },
            {
                username: "lolkekchebureck",
                fullname: "Cameron Williamson",
                photoURL: "img/Avatar.png",
                onlineStatus: "В сети",
            },
            {
                username: "lolkekchebureck",
                fullname: "Cameron Williamson",
                photoURL: "img/Avatar.png",
                onlineStatus: "В сети",
            },
            {
                username: "lolkekchebureck",
                fullname: "Cameron Williamson",
                photoURL: "img/Avatar.png",
                onlineStatus: "В сети",
            },
            {
                username: "lolkekchebureck",
                fullname: "Cameron Williamson",
                photoURL: "img/Avatar.png",
                onlineStatus: "В сети",
            },
        ];
    }

    getHTML() {
        //this.getData();
        chatsapi.getContacts()
        this.data=chatsapi.getCon
        this.data.forEach(element => {
            element.fullname=element.name
        });
        const template = Handlebars.templates["AddMembers.hbs"];
        const contacts = this.data;
        const html = template({ contacts });

        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");

        const domElement = doc.body.firstChild;

        this.container = domElement;

        this.addListeners();

        return domElement;
    }

    addListeners() {
        // Назад (создать группу)
        const buttonBack = this.container.querySelector("#button-back");
        buttonBack.addEventListener("click", (event) => {
            event.preventDefault();
            eventBus.emit("add members -> new group");
        });

        const memberItems =
            this.container.querySelectorAll(".sidebar-list-item");
        for (const memberItem of memberItems) {
            memberItem.addEventListener("click", (event) => {
                const checkbox = memberItem.querySelector("input");

                if (event.target !== checkbox) {
                    checkbox.checked = !checkbox.checked;
                }
            });
        }

        // Далее (завершить создание чата)
        const buttonNext = this.container.querySelector(
            ".sidebar__fixed-button",
        );
        buttonNext.addEventListener("click", (event) => {
            event.preventDefault();
            let res=[]
            const memberItems =
            this.container.querySelectorAll(".sidebar-list-item");
            let r
        for (const memberItem of memberItems) {
                const checkbox = memberItem.querySelector("input");
                r=checkbox.id
                console.log(r.substring(0,r.length-"-checkbox".length),checkbox.checked)
                if (checkbox.checked){
                    res.push(r.substring(0,r.length-"-checkbox".length))
                }
                console.log(createGroup.group_name)
                console.log(createGroup.extra_info)
        }
        console.log(res,chatsapi.chats)
        chatsapi.addusergroup(res,chatsapi.chats[chatsapi.chats.length-1].id)
        //chatsapi.addgroup(createGroup.group_name,r.substring(0,r.length-"-checkbox".length))
            const infoMessage = `Эта функция на этапе разработки.

После создания группы вы будете перенаправлены в список чатов, в котором появится созданная группа.

Также сразу же откроется окно чата с этой группой. В чат автоматически добавится сообщение типа "event" со значением "Вы создали группу".`;
            //alert(infoMessage);
            eventBus.emit("add members -> next");
        });
    }
}

export const addMembers = new AddMembers();
