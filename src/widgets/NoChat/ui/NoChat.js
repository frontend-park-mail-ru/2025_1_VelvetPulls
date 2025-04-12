class NoChat {
    constructor(parent) {
        this.parent = parent;
    }

    getHTML() {
        const dialogTemplate = Handlebars.templates["NoChat.hbs"];
        const html = dialogTemplate();

        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");
        const container = doc.body.firstChild;
        this.container = container;

        return container;
    }
}

export const noChat = new NoChat();
