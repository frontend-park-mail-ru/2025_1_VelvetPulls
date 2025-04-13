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
        try {
            const response = await fetch(`http://localhost:8080/api/chats`, {
                method: "GET",
                credentials: "include",
            });

            if (response.ok) {
                const data = await response.json();
                this.chats=data.data
            }
        } catch (err) {
            console.error(err);
        }
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
    /**
     * Авторизация пользователя
     * @param {string} username
     * @param {string} password
     * @returns {boolean} Получение ответа от сервера
     */
    async addgroup(title, user) {
    //     Type       string `json:"type" valid:"in(dialog|group|channel),required"`
	// Title      string `json:"title" valid:"required~Title is required,length(1|100)"`
	// DialogUser string `json:"dialog_user,omitempty" valid:"-"`
    const chatData={
        type:"group",
        dialog_user:user,
        title:title,
    }
    const fo=new FormData()
    fo.append("chat_data",JSON.stringify(chatData))

    await api.post("/chat", fo)
        try {
            const response = await fetch(`http://localhost:8080/api/chats`, {
                method: "GET",
                credentials: "include",
            });

            if (response.ok) {
                const data = await response.json();
                this.chats=data.data
            }
        } catch (err) {
            console.error(err);
        }
        console.log(this.chats[this.chats.length-1])
    }
    async addusergroup(users,id) {
        //     Type       string `json:"type" valid:"in(dialog|group|channel),required"`
        // Title      string `json:"title" valid:"required~Title is required,length(1|100)"`
        // DialogUser string `json:"dialog_user,omitempty" valid:"-"`
        //let id=this.chats[this.chats.length-1]
        const chatData={
            added_users:["vden55"],
            not_added_users:[]
        }
        const fo=new FormData()
        fo.append("chat_data",JSON.stringify(chatData))
    
        await api.post("/chat/"+id+"/users", users)
            try {
                const response = await fetch(`http://localhost:8080/api/chats`, {
                    method: "GET",
                    credentials: "include",
                });
    
                if (response.ok) {
                    const data = await response.json();
                    this.chats=data.data
                }
            } catch (err) {
                console.error(err);
            }
            console.log(this.chats)
        }
}
export const chatsapi = new ChatsApi();