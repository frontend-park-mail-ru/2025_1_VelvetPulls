import { handleChats } from "../../handlers/chatsHandler.js";

class ChatsPage {
    constructor() {}

    async render() {
        const chatsTemplate = Handlebars.templates["chats.hbs"];
        const chats = await handleChats([]);
        const html = chatsTemplate(chats);

        const root = document.getElementById("root");
        root.innerHTML = html;

        return {
            ok: true,
            error: "",
        };
    }
}

const chatsPage = new ChatsPage();
export default chatsPage;
