import { api } from "../../../shared/api/api.js";
import { getAvatar } from "../../../shared/helpers/getAvatar.js";

export const getProfile = async () => {
    const response = await api.get("/profile");
    const responseData = response.data;

    const avatarSrc = await getAvatar(responseData["avatar_path"]);

    const returnData = {
        firstName: responseData["first_name"],
        lastName: responseData["last_name"],
        username: responseData["username"],
        phone: responseData["phone"],
        email: responseData["email"],
        avatarSrc: avatarSrc,
    };

    return returnData;
};
