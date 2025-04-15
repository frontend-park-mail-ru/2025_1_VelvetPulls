import { api } from "../../../shared/api/api.js";
import { eventBus } from "../../../shared/modules/EventBus/EventBus.js";

export const getUserData = async (username = null) => {
    let response;
    if (username === null) {
        response = await api.get("/profile");
    } else {
        response = await api.get(`/profile/${username}`);
    }

    if (response.status === false) {
        if (response.error === "Unauthorized") {
            eventBus.emit("logout");
            // throw Error("Unauthorized");
        }
    }

    const data = response.data;
    return data;
};

export const updateUser = async (formData) => {
    await api.put("/profile", formData);

    const updatedData = getUserData(null);
    return updatedData;
};
