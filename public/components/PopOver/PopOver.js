export class PopOver {
    constructor(items) {
        this.items = items;
    }

    getHTML() {
        const template = Handlebars.templates["PopOver.hbs"];

        const items = this.items;

        const element = document.createElement("div");
        element.innerHTML = template({
            items,
        });

        return element;
    }
}
