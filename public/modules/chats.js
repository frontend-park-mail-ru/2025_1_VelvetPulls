import { api } from "./api.js";

export class ChatsApi {
    constructor() {
        this.api = api;
    }

    async getChats() {
        return await this.api.get("/chats");
    }
}
