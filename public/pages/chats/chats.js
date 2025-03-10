import { handleChats } from "../../handlers/chatsHandler.js";
export const renderChats = async (data) => {
    const chatsTemplate = Handlebars.templates['chats.hbs'];

    try {
        const actualData = await handleChats(data);
        console.log(`То что получил:`, actualData);

        const html = chatsTemplate(actualData);

        return {
            html,
            addListeners: () => {
                const chatItems = document.querySelectorAll('.chat-item');
                chatItems.forEach((item) => {
                    item.addEventListener('click', () => {
                        console.log('Чат выбран:', item.dataset.chatId);
                    });
                });
            },
        };
    } catch (error) {
        console.error('Ошибка при рендеринге чатов:', error);
        return {
            html: '<p>Произошла ошибка при загрузке чатов.</p>',
            addListeners: () => {},
        };
    }
};
