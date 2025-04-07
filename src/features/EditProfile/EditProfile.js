export class EditProfile {
    constructor(parentWidget) {
        this.parentWidget = parentWidget;
        this.data = {};

        console.log("edit profile constructor");
    }

    getData() {
        this.data = {
            firstName: "Михал",
            lastName: "Палыч",
            onlineStatus: "В сети",
            avatarUrl: "img/Avatar.png",
            phone: "+7-777-777-77-77",
            username: "moneyman",
            bio: "23 года, дизайнер из Санкт-Петербурга",
        };
    }

    getHTML() {
        this.getData();

        const editProfileTemplate = Handlebars.templates["EditProfile.hbs"];
        const html = editProfileTemplate({ ...this.data });
        console.log("here");

        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");

        const container = doc.body.firstChild;
        this.container = container;

        this.container = container;
        this.addListeners();

        return container;
    }

    addListeners() {
        // Назад (в профиль)
        const backButton = this.container.querySelector("#button-back");
        backButton.addEventListener("click", (event) => {
            event.preventDefault();

            this.parentWidget.goTo("profile");
        });

        // Сохранить изменения
        const saveButton = this.container.querySelector("#button-save");
        saveButton.addEventListener("click", (event) => {
            event.preventDefault();

            this.parentWidget.goTo("profile");
        });
    }
}
