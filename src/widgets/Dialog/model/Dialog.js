import { dialogInfo } from "../../DialogInfo/index.js";

class Dialog {
    constructor(parent) {
        this.parent = parent;
    }

    getHTML() {
        const dialogTemplate = Handlebars.templates["Dialog.hbs"];
        const html = dialogTemplate();

        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");
        const container = doc.body.firstChild;

        const dialogInfoContainer = dialogInfo.getHTML();
        const divider = container.querySelector(".vertical-divider");
        divider.after(dialogInfoContainer);

        return container;
    }
}

export const dialog = new Dialog();
