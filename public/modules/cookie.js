/**
 * Получает значение куки по имени.
 *
 * @param {string} name - Имя куки.
 * @returns {string|null} - Значение куки или null, если кука не найдена.
 */
export const getCookie = (name) => {
    const cookies = document.cookie.split(";").map((cookie) => cookie.trim());
    const targetCookie = cookies.find((cookie) => cookie.startsWith(`${name}=`));

    if (targetCookie) {
        return targetCookie.split("=")[1];
    }
    return null;
};