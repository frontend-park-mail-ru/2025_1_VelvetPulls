import { API } from "./api"

export class auth {
    constructor() {
        this.API = API;
    }

    async login(email, password) {
        try {
            const response = await this.API.post('/login', { email, password });
            if (response.success) {
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

    async register(email, password) {
        try {
            const response = await this.API.post('/register', { email, password });
            if (response.success) {
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

    getToken() {
        return localStorage.getItem('token');
    }
}