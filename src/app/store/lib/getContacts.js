import { api } from "../../../shared/api/api.js";
import { getAvatar } from "../../../shared/helpers/getAvatar.js";

export const getContacts = async () => {
    const response = await api.get("/contacts");
    const contacts = response.data;

    if (contacts === null) {
        return [];
    }

    const returnData = [];
    for (const contact of contacts) {
        const avatarSrc = await getAvatar(contact["avatar_path"]);

        returnData.push({
            username: contact["username"],
            avatarSrc: avatarSrc,
        });
    }

    return returnData;
};
