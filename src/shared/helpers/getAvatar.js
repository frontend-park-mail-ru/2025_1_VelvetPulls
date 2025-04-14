const map = new Map();

export const getAvatar = async (avatarPath) => {
    if (avatarPath === null || avatarPath === undefined) {
        return null;
    }

    if (map.has(avatarPath)) {
        return map.get(avatarPath);
    }

    avatarPath = avatarPath.slice(1);

    const url = `http://90.156.217.108:8080/${avatarPath}`;
    const response = await fetch(url);

    const blob = await response.blob();
    const src = URL.createObjectURL(blob);

    map.set(avatarPath, src);

    return src;
};
