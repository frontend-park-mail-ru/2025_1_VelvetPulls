import { api } from "../../../shared/api/api.js";
import { getAvatar } from "../../../shared/helpers/getAvatar.js";

export const getChats = async (profile) => {
    const response = await api.get("/chats");
    const chats = response.data;

    if (chats === null) {
        return [];
    }

    const returnData = [];
    for (const chat of chats) {
        const avatarSrc = await getAvatar(chat["avatar_path"]);

        let isOwner = true;
        if (chat["type"] == "group") {
            const responseBody = await api.get(`/chat/${chat["id"]}`);

            const users = responseBody["data"]["users"];

            const currentMember = users.find(
                (item) => item["username"] === profile["username"],
            );

            if (currentMember["role"] === "member") {
                isOwner = false;
            }
        }

        returnData.push({
            title: chat["title"],
            chatId: chat["id"],
            type: chat["type"],
            isOwner: isOwner,
            avatarSrc: avatarSrc,
        });
    }

    return returnData;
};
