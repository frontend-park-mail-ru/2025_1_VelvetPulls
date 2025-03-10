export const renderChats = (data) => {
    const chatsTemplate = Handlebars.templates['chats.hbs'];
    const html = chatsTemplate(data);

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
