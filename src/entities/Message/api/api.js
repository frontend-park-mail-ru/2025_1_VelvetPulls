import { api } from "../../../shared/api/api.js";
import { Message } from "../model/Message.js";

export const getMessageHistory = async (chatId, currentUserId) => {
    try {
        const response = await api.get(`/chat/${chatId}/messages`);
        // const messages = response.data.map(msg => Message.fromApi(msg, currentUserId));
        return {
            ok: true,
            // data: messages
            data: response.data,
        };
    } catch (error) {
        return {
            ok: false,
            error: error.message,
        };
    }
};

export const sendMessage = async (chatId, inputMessageValue) => {
    try {
        const response = await api.post(
            `/chat/${chatId}/messages`,
            { message: inputMessageValue },
            // message.toApiFormat(),
        );
        return {
            ok: true,
            data: Message.fromApi(response.data),
        };
    } catch (error) {
        return {
            ok: false,
            error: error.message,
        };
    }
};
