import { api } from "./api.js";

export class ProfileApi{
    constructor() {
        this.api = api;
    }

    async getProfile() {
        return await this.api.get("/profile");
    }
}
