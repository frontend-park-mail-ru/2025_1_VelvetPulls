import { API } from "./api.js";

export class chats {
    constructor() {
        this.API = API;
    }

    async getChats() {
        try {
            const response = await this.API.get("/chats/");
            console.log(`ответ от бэка ${response}`);
            if (response.status) {
                return response.data;
            } else {
                throw new Error(response.message || "Failed to fetch chats");
            }
        } catch (error) {
            console.error("Error fetching chats:", error);
            return null;
        }
    }
}
