// import { dialogInfo } from "../../DialogInfo/index.js";
import { eventBus } from "../../../shared/modules/EventBus/EventBus.js";

class Dialog {
    getHTML() {
        console.log("dialog user:", this.user);

        console.log("full name:", this.user.getFullName());

        const data = {
            fullName: this.user.getFullName(),
            avatarSrc: this.user.avatarSrc,
        };

        const dialogTemplate = Handlebars.templates["Dialog.hbs"];
        const html = dialogTemplate({ ...data });

        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");
        const container = doc.body.firstChild;

        // const dialogInfoContainer = dialogInfo.getHTML();
        // const divider = container.querySelector(".vertical-divider");
        // divider.after(dialogInfoContainer);

        return container;
    }

    addListeners() {
        const closeButton = this.container.querySelector("#close-chat");
        closeButton.AddEventListener("click", (event) => {
            event.preventDefault();
            event.stopPropagation();

            eventBus.emit("close dialog");
        });
    }

    setUser(user) {
        this.user = user;
        console.log("set user:", this.user);
    }
}

export const dialog = new Dialog();
