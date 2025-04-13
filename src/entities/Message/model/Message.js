import { getMessageHistory, sendMessage } from "../api/api";

export class Message{
    #ParentMessageID; 
	#ChatID;          
	#UserID;          
	#Body;           
	#SentAt;          
	#IsRedacted;     
	#AvatarPath;
	#Username;

    constructor(data){
        this.init(data);
    }

    async init(data){
        this.#ParentMessageID; 
        this.#ChatID = data["ChatID"];          
        this.#UserID = data["UserID"];          
        this.#Body = data["Body"];           
        this.#SentAt = data["SentAt"];          
        this.#IsRedacted = data["IsRedacted"];     
        this.#AvatarPath = data["AvatarPath"];
        this.#Username = data["Username"];
    }

    async MessageHistory(){
        const data = await getMessageHistory(this.#ChatID);
        return data;
    }

    async SendThisMessage(message){
        const res = await sendMessage(this.#ChatID, message);
        return res;
    }
}

export const MessageApi = new Message();