import { api } from "./api.js";

export class Chats {
    constructor() {
        this.api = api;
    }

    async getChats() {
        return await this.api.get("/chats/");
    }
}
