export const API_URI = "http://localhost:8080/api";

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
    async request(method, path, body = null) {
        let response = null;

        try {
            const url = this.#api + path;
            const request = {
                method: method,
                headers: {},
                mode: "cors",
                credentials: "include",
            };

            if (body) {
                if (body instanceof FormData) {
                    request.body = body;
                    // request.headers["Content-Type"] = "multipart/form-data";
                } else {
                    request.body = JSON.stringify(body);
                    request.headers["Content-Type"] = "application/json";
                }
            }

            response = await fetch(url, request);
        } catch (error) {
            throw new Error("Could not fetch: " + error.message);
        }

        console.log("api response:", response);

        if (response.statusText === "No Content") {
            return null;
        }

        const responseJSON = await response.json();
        return responseJSON;
    }

    async get(url) {
        return this.request("GET", url);
    }

    async post(url, body = null) {
        return this.request("POST", url, body);
    }

    async put(url, body = null) {
        return this.request("PUT", url, body);
    }

    async delete(url) {
        return this.request("DELETE", url);
    }
}

export const api = new API();
