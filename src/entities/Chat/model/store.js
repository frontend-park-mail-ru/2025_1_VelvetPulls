import { getChats } from "../api/api.js";
import { Chat } from "./Chat.js";

class ChatsStore {
    constructor() {
        this.chats = [];
    }

    async init() {
        const responseData = getChats();
        console.log("response data:", responseData);
    }

    createChat(chatId) {
        // TODO
    }
}

export const chatsStoreInstance = new ChatsStore();
chatsStoreInstance.init();
