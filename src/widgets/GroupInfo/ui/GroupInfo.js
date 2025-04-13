import { eventBus } from "../../../shared/modules/EventBus/EventBus.js";

class GroupInfo {
    constructor() {}

    getHTML() {
        chatsapi.getContacts()
        const members=chatsapi.getCon
        // const members = [
        //     {
        //         name: "Cameron Williamson",
        //         photoURL: "img/Avatar.png",
        //         onlineStatus: "В сети",
        //     },
        //     {
        //         name: "Cameron Williamson",
        //         photoURL: "img/Avatar.png",
        //         onlineStatus: "В сети",
        //     },
        //     {
        //         name: "Cameron Williamson",
        //         photoURL: "img/Avatar.png",
        //         onlineStatus: "В сети",
        //     },
        //     {
        //         name: "Cameron Williamson",
        //         photoURL: "img/Avatar.png",
        //         onlineStatus: "В сети",
        //     },
        // ];

        const data = {
            groupPhotoUrl: "img/Keftegram.png",
            title: "Михал",
            description: "Палыч",
            members: members,
            membersCount: members.length,
        };

        const groupInfoTemplate = Handlebars.templates["GroupInfo.hbs"];
        const html = groupInfoTemplate({ ...data });

        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");
        const container = doc.body.firstChild;
        this.container = container;

        this.addListeners();

        return container;
    }

    addListeners() {
        const buttonClose = this.container.querySelector("#close-chat-info");
        buttonClose.addEventListener("click", (event) => {
            event.preventDefault();

            this.container.parentElement.removeChild(this.container);
            eventBus.emit("group-info: close", {});
        });
    }
}

export const groupInfo = new GroupInfo();
