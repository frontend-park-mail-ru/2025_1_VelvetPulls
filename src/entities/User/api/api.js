import { api } from "../../../shared/api/api.js";

export const getUserData = async (username = null) => {
    let response;
    if (username === null) {
        response = await api.get("/profile");
    } else {
        response = await api.get(`/profile/${username}`);
    }
    console.log("get user data:", response);
    const data = response.data;
    return data;
};

export const updateUser = async (formData) => {
    // const response = await api.put("/profile", data);

    const response = await api.put("/profile", formData);
    console.log("response:", response);
    // console.log(response);

    const updatedData = getUserData(null);
    console.log("updated data:", updatedData);
    return updatedData;
};
