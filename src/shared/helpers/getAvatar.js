import { API_HOST, API_PORT } from "../api/api.js";

const map = new Map();

export const getAvatar = async (avatarPath) => {
    if (avatarPath === null || avatarPath === undefined) {
        return null;
    }

    if (map.has(avatarPath)) {
        return map.get(avatarPath);
    }

    avatarPath = avatarPath.slice(1);

    const url = `http://${API_HOST}:${API_PORT}/${avatarPath}`;
    const response = await fetch(url);

    const blob = await response.blob();
    const src = URL.createObjectURL(blob);

    map.set(avatarPath, src);

    return src;
};
