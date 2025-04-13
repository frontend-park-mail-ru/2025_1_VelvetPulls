import { api } from "../../../shared/api/api.js";

export const getMessageHistory = async (chatId) => {
    try {
        const response = await api.get(`/chat/${chatId}/messages`);
        return {
            ok: true,
            data: response,
        };
    } catch (error) {
        return {
            ok: false,
            error: error.message,
        };
    }
};

export const sendMessage = async (chatId, message) => {
    try {
        const response = await api.post(`/chat/${chatId}/messages`, message);
        return {
            ok: true,
            data: response,
        };
    } catch (error) {
        return {
            ok: false,
            error: error.message,
        };
    }
};
