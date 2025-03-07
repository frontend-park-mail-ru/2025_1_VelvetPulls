import {API_URI} from "../config/const";


export class API {
    #api;

    constructor() {
        this.#api = API_URI;
    }
}
