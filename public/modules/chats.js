import { API } from "./api.js"

export class Chats {
    constructor() {
        this.API = API;
    }
    async getChats() {
        try {
            const response = await this.API.get('/chats');
            if (response.success) {
                localStorage.setItem('token', response.token);
                return true;
            } else {
                throw new Error(response.message || ' failed');
            }
        } catch (error) {
            console.error('Login error:', error);
            return false;
        }
    }
}