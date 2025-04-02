import { api } from "./api.js";

export class ProfileApi{
    constructor() {
        this.api = api;
    }

    async getProfile() {
        return await this.api.get("/profile");
    }
    async updateProfile(profileData) {
        const headers = {
            "Content-Type": "application/json;charset=utf-8",
        };
        return await this.api.request("PUT", "/profile", headers, profileData);
    }

    async deleteProfile() {
        return await this.api.delete("/profile");
    }

    async uploadAvatar(avatarFile) {
        const formData = new FormData();
        formData.append("avatar", avatarFile);
        
        const headers = {};
        delete headers["Content-Type"];
        
        return await this.api.request("POST", "/profile/avatar", headers, formData);
    }
}
