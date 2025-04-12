import { eventBus } from "../../../shared/modules/EventBus/EventBus.js";
import { groupInfo } from "../../GroupInfo/index.js";

class Group {
    constructor() {
        this.infoIsOpen = false;

        eventBus.on("group-info: close", () => {
            this.infoIsOpen = false;
        });
    }

    getHTML() {
        const dialogTemplate = Handlebars.templates["Group.hbs"];
        const html = dialogTemplate();

        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");
        const container = doc.body.firstChild;
        this.container = container;

        this.addListeners();

        return container;
    }

    addListeners() {
        const header = this.container.querySelector(".chat-header");
        header.addEventListener("click", (event) => {
            event.preventDefault();

            if (!this.infoIsOpen) {
                const groupInfoContainer = groupInfo.getHTML();
                const divider =
                    this.container.querySelector(".vertical-divider");
                divider.after(groupInfoContainer);
                this.infoIsOpen = true;
            }
        });
    }
}

export const group = new Group();
