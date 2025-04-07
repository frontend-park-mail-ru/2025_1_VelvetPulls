export class PopOver {
    constructor({ parentElement, items, position }) {
        this.parentElement = parentElement;
        this.items = items;
        this.position = position;
        this.container = null;
        this.status = false;
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

        this.addListeners();

        console.log("change status on true");
        this.status = true;

        return container;
    }

    addListeners() {
        console.log("popver addListeners");
        console.log(this.status);

        // Закрытие при клике вне popover
        document.addEventListener("click", (event) => {
            event.preventDefault();
            event.stopPropagation();

            console.log(this);

            if (this.status) {
                event.preventDefault();

                console.log("click outside from popover");
                console.log(event.target);

                // if (this.menu && !event.target.closest(".sidebar__menu")) {
                //     this.closeMenu();
                // }

                this.close();
            }
        });
    }

    close() {
        this.parentElement.removeChild(this.container);
        this.status = false;
    }
}
