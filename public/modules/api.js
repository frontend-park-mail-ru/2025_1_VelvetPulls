const API_URI = "http://localhost:8080/api";

class API {
    #api;

    constructor() {
        this.#api = API_URI;
    }
    /**
     * Выполняет асинхронный HTTP-запрос к API.
     *
     * @async
     * @function request
     * @param {string} method - HTTP-метод запроса (например, 'GET', 'POST', 'PUT', 'DELETE').
     * @param {string} path - Путь к ресурсу API (например, '/users' или '/posts/1').
     * @param {Object} headers - Заголовки запроса в виде объекта (например, { 'Content-Type': 'application/json' }).
     * @param {Object|null} [body=null] - Тело запроса (например, { name: 'John', age: 30 }). Если тело отсутствует, передайте `null`.
     * @returns {Promise<Object>} - Возвращает промис, который разрешается в JSON-ответ от сервера.
     * @throws {Error} - Если запрос не удался, выбрасывает ошибку с сообщением.
     *
     */
    async request(method, path, headers, body = null) {
        let response = null;

        try {
            const url = this.#api + path;
            const request = {
                method: method,
                headers: headers,
                mode: "cors",
                credentials: "include",
                body: body ? JSON.stringify(body) : null,
            };

            response = await fetch(url, request);
        } catch (error) {
            throw new Error("Could not fetch: " + error.message);
        }

        const responseJSON = await response.json();
        return responseJSON;
    }

    async get(url) {
        return this.request("GET", url, {});
    }

    async post(url, body = null) {
        const headers = {
            "Content-Type": "application/json;charset=utf-8",
        };
        return this.request("POST", url, headers, body);
    }

    async delete(url) {
        return this.request("DELETE", url, {});
    }
}

export const api = new API();
