export class CreateGroup {
    constructor(parentWidget) {
        this.parentWidget = parentWidget;
        this.data = {};
    }

    getHTML() {
        const createGroupTemplate = Handlebars.templates["CreateGroup.hbs"];
        const html = createGroupTemplate({});

        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");

        const container = doc.body.firstChild;
        this.container = container;

        this.container = container;
        this.addListeners();

        return container;
    }

    addListeners() {
        // Назад (в чаты)
        const backButton = this.container.querySelector("#button-back");
        backButton.addEventListener("click", (event) => {
            event.preventDefault();

            this.parentWidget.goTo("chats");
        });

        // Далее (добавить участников)
        const nextButton = this.container.querySelector("#button-next");
        nextButton.addEventListener("click", (event) => {
            event.preventDefault();

            // alert("add-members");
            this.parentWidget.goTo("add-members");
        });
    }
}
