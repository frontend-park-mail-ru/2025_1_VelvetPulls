import { api } from "./api.js";
import { eventBus } from "../modules/EventBus/EventBus.js";

export class ChatsApi {
    constructor() {
        this.api = api;
        this.contacts=[]
        this.getContacts()
    }
    get getCon(){
        //console.log(this.ajax)
        let array=this.ajax
        let res=[]
        if (array==null){
            return res
        }
        array.forEach(element => {
            res.push({
                name: element.username,
                photoURL: "img/Avatar.png",
                onlineStatus: "В сети",
            })
        });
        console.log(this.contacts)
        return res
    }
    /**
     * Авторизация пользователя
     * @param {string} username
     * @param {string} password
     * @returns {boolean} Получение ответа от сервера
     */
    async addcon(username) {
        this.contacts.push(username)
        this.api.post("/contacts", {
            username
        });
        try {
            const response = await fetch(`http://localhost:8080/api/contacts`, {
                method: "GET",
                credentials: "include",
            });

            if (response.ok) {
                const data = await response.json();
                this.ajax=data.data
            }
        } catch (err) {
            console.error(err);
        }
    }

    async deleteAjax(id1){
        try {
            const response = await fetch(`http://localhost:8080/api/contacts`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({username:id1}),
            });
        } catch (err) {
            console.error(err);
        }
        try {
            const response = await fetch(`http://localhost:8080/api/contacts`, {
                method: "GET",
                credentials: "include",
            });

            if (response.ok) {
                const data = await response.json();
                this.ajax=data.data
            }
        } catch (err) {
            console.error(err);
        }
        eventBus.emit("contacts -> contacts");
    }

    async getChats() {
        return await this.api.get("/chats/");
    }
    async getContacts(){
            try {
                const response = await fetch(`http://localhost:8080/api/contacts`, {
                    method: "GET",
                    credentials: "include",
                });
    
                if (response.ok) {
                    const data = await response.json();
                    this.ajax=data.data
                }
            } catch (err) {
                console.error(err);
            }
            try {
                const response = await fetch(`http://localhost:8080/api/contacts`, {
                    method: "GET",
                    credentials: "include",
                });
    
                if (response.ok) {
                    const data = await response.json();
                    this.ajax=data.data
                }
            } catch (err) {
                console.error(err);
            }
    }
}
export const chatsapi = new ChatsApi();