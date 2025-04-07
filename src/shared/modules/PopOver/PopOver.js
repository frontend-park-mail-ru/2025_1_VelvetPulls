export class PopOver {
    constructor({ items, position }) {
        this.items = items;
        this.position = position;
        this.container = null;
    }

    getHTML() {
        const template = Handlebars.templates["PopOver.hbs"];
        const html = template({ items: this.items });

        const parser = new DOMParser();
        const parseResult = parser.parseFromString(html, "text/html");
        const container = parseResult.body.firstChild;

        this.container = container;
        if (this.position.top !== null) {
            this.container.style.top = this.position.top;
        }
        if (this.position.left !== null) {
            this.container.style.left = this.position.left;
        }
        if (this.position.bottom !== null) {
            this.container.style.bottom = this.position.bottom;
        }
        if (this.position.right !== null) {
            this.container.style.bottom = this.position.bottom;
        }

        return container;
    }
}
