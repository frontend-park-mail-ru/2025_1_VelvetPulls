import { API } from "./api.js"

export class auth {
    constructor() {
        this.API = API;
    }

    async login(username, password) {
        try {
            const response = await this.API.post('/login/', { username, password });
            if (response.status === 200) {
                localStorage.setItem('token', response.token);
                return true;
            } else {
                throw new Error(response.message || 'Login failed');
            }
        } catch (error) {
            console.error('Login error:', error);
            return false;
        }
    }

    async register(username, phone, password, confirm_password) {
        try {
            const response = await this.API.post('/register/', { username, phone, password, confirm_password});
            if (response.status === 201) {
                return true;
            } else {
                throw new Error(response.message || 'Registration failed');
            }
        } catch (error) {
            console.error('Registration error:', error);
            return false;
        }
    }

    logout() {
        localStorage.removeItem('token');
    }

}

export const Auth = new auth();