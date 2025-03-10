import { chats } from "../modules/chats.js";
import { renderChats } from '../pages/chats/chats.js';

/**
 * Обработчик для получения данных чатов и рендеринга страницы 'chats'.
 *
 * @async
 * @function handleChats
 * @param {Object} data - Данные для рендеринга (если есть).
 * @returns {Object} - Объект с HTML и функцией для добавления обработчиков событий.
 *
 * @example
 * // Пример использования
 * const rendered = await handleChats();
 * root.innerHTML = rendered.html;
 * rendered.addListeners();
 */
export const handleChats = async (data) => {
    const chatsInstance = new chats();

    try {
        const chatsData = await chatsInstance.getChats();

        if (chatsData) {
            return renderChats(chatsData);
        } else {
            alert('Не удалось загрузить чаты. Пожалуйста, попробуйте позже.');
            return renderChats(data); 
        }
    } catch (error) {
        console.error('Ошибка при загрузке чатов:', error);
        alert('Произошла ошибка при загрузке чатов.');
        return renderChats(data); 
    }
};
