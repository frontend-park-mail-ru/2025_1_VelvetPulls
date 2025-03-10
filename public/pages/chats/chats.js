import { handleChats } from "../../handlers/chatsHandler.js";
export const renderChats = (data) => {
    const chatsTemplate = Handlebars.templates['chats.hbs'];
    const actualData = handleChats(data);
    console.log(`то что получил ${actualData}`);
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
};
