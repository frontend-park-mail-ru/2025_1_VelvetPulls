export function initApp() {
    const chatList = document.getElementById('chat-list');
    const chatTitle = document.getElementById('chat-title');
    const messagesContainer = document.getElementById('messages');
    const inputMessage = document.getElementById('input-message');
    const sendButton = document.getElementById('send-button');

    const chats = [
        { id: 1, name: 'Chat 1', messages: [] },
        { id: 2, name: 'Chat 2', messages: [] },
        { id: 3, name: 'Chat 3', messages: [] }
    ];

    function loadChats() {
        chatList.innerHTML = '';
        chats.forEach(chat => {
            const li = document.createElement('li');
            li.textContent = chat.name;
            li.addEventListener('click', () => loadChat(chat.id));
            chatList.appendChild(li);
        });
    }

    function loadChat(chatId) {
        const chat = chats.find(c => c.id === chatId);
        if (chat) {
            chatTitle.textContent = chat.name;
            messagesContainer.innerHTML = '';
            chat.messages.forEach(message => {
                const messageElement = document.createElement('div');
                messageElement.textContent = message;
                messagesContainer.appendChild(messageElement);
            });
        }
    }

    function sendMessage() {
        const message = inputMessage.value.trim();
        if (message) {
            const chat = chats.find(c => c.name === chatTitle.textContent);
            if (chat) {
                chat.messages.push(message);
                const messageElement = document.createElement('div');
                messageElement.textContent = message;
                messagesContainer.appendChild(messageElement);
                inputMessage.value = '';
            }
        }
    }

    sendButton.addEventListener('click', sendMessage);
    inputMessage.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    loadChats();
}