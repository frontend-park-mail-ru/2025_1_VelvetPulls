import { Chats } from "../../modules/chats.js";

class ChatsPage {
    constructor() {}

    async render() {
        const chatsInstance = new Chats();
        const response = await chatsInstance.getChats();
        console.log("response", response);

        if (response.status === false) {
            return {
                ok: false,
                error: response.error,
            };
        }

        const chatsTemplate = Handlebars.templates["chats.hbs"];
        const html = chatsTemplate({ chats: response.data });

        const root = document.getElementById("root");
        root.innerHTML = html;

        return {
            ok: true,
            error: "This is my error",
        };
    }
}

const chatsPage = new ChatsPage();
export default chatsPage;
