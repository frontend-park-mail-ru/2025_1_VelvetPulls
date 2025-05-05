import { api } from "../../../shared/api/api.js";
import { eventBus } from "../../../shared/modules/EventBus/EventBus.js";

export const getUserData = async (username = null) => {
    let response;
    let una=true
    if (username === null) {
        //response = await api.get("/profile");
        una=false
    } else {
        response = await api.get(`/profile/${username}`);
    }

    if (una === false) {
        //if (response.error === "Unauthorized") {
            eventBus.emit("logout");
            // throw Error("Unauthorized");
        //}
    }
    if (response!==undefined){
        return response.data
    }

    // const data = response.data;
    // return data;
};

export const updateUser = async (formData) => {
    await api.put("/profile", formData);

    const updatedData = getUserData(null);
    return updatedData;
};
