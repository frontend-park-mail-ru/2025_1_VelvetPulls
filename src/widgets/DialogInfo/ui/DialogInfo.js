import { eventBus } from "../../../shared/modules/EventBus/EventBus.js";

class DialogInfo {
    constructor() {}

    setUser(user) {
        this.user = user;
    }

    getHTML() {
        const data = {
            firstName: this.user.getFirstName(),
            lastName: this.user.getLastName(),
            onlineStatus: "В сети",
            avatarUrl: this.user.avatarSrc,
            phone: this.user.getPhone(),
            username: this.user.getUsername(),
            // bio: "23 года, дизайнер из Санкт-Петербурга",
            // birthday: "12 июня 2002 (22 года)",
        };

        const dialogInfoTemplate = Handlebars.templates["DialogInfo.hbs"];
        const html = dialogInfoTemplate({ ...data });

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
            console.log("here");
            eventBus.emit("close dialog info", {});
        });
    }
}

export const dialogInfo = new DialogInfo();
