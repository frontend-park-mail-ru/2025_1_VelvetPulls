import { api } from "../../../shared/api/api.js";

export const createChat = async (chatData = null, avatar = null) => {
    const formData = new FormData();

    if (chatData !== null) {
        formData.append("chat_data", JSON.stringify(chatData));
    }

    if (avatar !== null) {
        formData.append("avatar", avatar);
    }

    const responseBody = await api.post("/chat", formData);

    console.log("create chat response:", responseBody);

    if (responseBody.status !== true) {
        throw Error("Возникла ошибка при создании чата:", responseBody.error);
    }

    console.log("Чат успешно создан:", responseBody.data);
};

export const getChatInfo = (chatId) => {
    // TODO
};

export const updateChat = (chatId, chatData, avatar) => {
    // TODO
};

export const deleteChat = async (chatId) => {
    return await api.delete(`/chat/${chatId}`);
};

export const addMembers = (chatId, usernames) => {
    // TODO
};

export const deleteMembers = (chatId, usernames) => {
    // TODO
};

export const getChats = async () => {
    return await api.get("/chats");
};
