class DialogInfo {
    constructor() {}

    getHTML() {
        const data = {
            firstName: "Михал",
            lastName: "Палыч",
            onlineStatus: "В сети",
            avatarUrl: "img/Keftegram.png",
            phone: "+7 777 777-77-77",
            username: "moneyman",
            bio: "23 года, дизайнер из Санкт-Петербурга",
            birthday: "12 июня 2002 (22 года)",
        };

        const dialogInfoTemplate = Handlebars.templates["DialogInfo.hbs"];
        const html = dialogInfoTemplate({ ...data });

        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");

        const container = doc.body.firstChild;
        return container;
    }
}

export const dialogInfo = new DialogInfo();
