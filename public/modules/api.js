import {API_URI} from "../config/const.js";

class api {
    #api;

    constructor() {
        this.#api = API_URI;
    }

    async request(method, path, headers, body = null) {
        try {
            const url = this.#api + path;
            const state = {
                method: method,
                headers: headers,
                mode: 'cors',
                credentials: 'include',
                body: body ? JSON.stringify(body) : null,
            };

            const response = await fetch(url, state);
            return await response.json();
        } catch (error) {
            throw new Error('Could not fetch: ' + error.message);
        }
    }

    async get(url) {
        return this.request('GET', url, {});
    }

    async post(url, body = null) {
        const headers = {
            'Content-Type': 'application/json;charset=utf-8',
        };
        return this.request('POST', url, headers, body);
    }
    
    async delete(url) {
        return this.request('DELETE', url, {});
    }
}

export const API = new api();