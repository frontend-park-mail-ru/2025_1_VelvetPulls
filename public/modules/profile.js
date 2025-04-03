import { api } from "./api.js";

export class ProfileApi {
    constructor() {
        this.api = api;
    }

    async getProfile() {
        return await this.api.get("/profile");
    }

    async updateProfile(profileData = null, avatarFile = null) {
        const formData = new FormData();
        
        if (avatarFile) {
            formData.append("avatar", avatarFile);
        }
        
        if (profileData) {
            formData.append("profile_data", JSON.stringify(profileData));
        }
        
        if (!avatarFile && !profileData) {
            throw new Error("Не указаны данные для обновления");
        }
        
        const headers = {};
        const response = await this.api.request("PUT", "/profile", headers, formData);
        
        if (response.data?.avatar_path) {
            response.data.avatar_url = `${this.api.api}${response.data.avatar_path.replace(/^\./, '')}`;
        }
        
        return response;
    }

    async deleteProfile() {
        return await this.api.delete("/profile");
    }
}