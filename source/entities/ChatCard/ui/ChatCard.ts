import { TChat } from "@/entities/Chat/model/type";
import ChatCardTemplate from "./ChatCard.handlebars";
import "./ChatCard.scss";
import { Chat } from "@/widgets/Chat";
import { serverHost, staticHost } from "@/app/config";
import { ChatStorage } from "@/entities/Chat/lib/ChatStore";
import { getTimeString } from "@/shared/helpers/getTimeString";
import { UserNotification } from "@/feature/Notification";

export class ChatCard {
  #parent;
  #chat;

  constructor(parent: Element, chat: Chat) {
    this.#parent = parent;
    this.#chat = chat;
  }

  // Унифицированный метод нормализации данных чата
  private normalizeChat(chat: TChat): TChat {
    return {
      ...chat,
      // Если приходит только chat_id, используем его как chatId
      chatId: chat.chatId || chat.chat_id || '',
      // Нормализация последнего сообщения
      lastMessage: this.normalizeLastMessage(chat.lastMessage)
    };
  }

  // Унифицированный метод нормализации последнего сообщения
  private normalizeLastMessage(message: any) {
    if (!message) return null;
    
    return {
      ...message,
      // Используем text если body отсутствует
      body: message.body || message.text || '',
      // Нормализация времени
      sent_at: message.sent_at || message.datetime || new Date().toISOString(),
      // Определение типа контента
      displayContent: this.getDisplayContent(message)
    };
  }

  // Определение отображаемого контента
  private getDisplayContent(message: any): string {
    if (message.sticker && message.sticker !== "") {
      return "[Стикер]";
    }
    
    // Используем text если body отсутствует
    const content = message.body || message.text || "";
    if (content !== "") {
      return content;
    }
    
    // Проверяем наличие вложений
    if ((message.files && message.files.length > 0) || 
        (message.photos && message.photos.length > 0)) {
      return "[Вложения]";
    }
    
    return "Нет новых сообщений";
  }

  async render(chat: TChat, notificate = false, notificationChat: TChat | null = null) {
    // Нормализуем входящие данные
    const normalizedChat = this.normalizeChat(notificationChat || chat);

    let avatar;
    if (normalizedChat.avatarPath && normalizedChat.avatarPath !== "") {
      avatar = staticHost + normalizedChat.avatarPath;
    } else {
      avatar = "/assets/image/default-avatar.svg";
    }

    // Форматируем время последнего сообщения
    const lastMessageTime = normalizedChat.lastMessage?.sent_at 
      ? getTimeString(normalizedChat.lastMessage.sent_at)
      : '';

    this.#parent.insertAdjacentHTML(
      "beforeend",
      ChatCardTemplate({
        chat: {
          ...normalizedChat,
          lastMessage: normalizedChat.lastMessage
            ? {
                ...normalizedChat.lastMessage,
                sent_at: lastMessageTime,
                displayContent: this.getDisplayContent(normalizedChat.lastMessage)
              }
            : {
                sent_at: '',
                displayContent: 'Чат пока пуст'
              }
        },
        avatar,
      }),
    );
    
    const chatCardElement = this.#parent.lastElementChild!;
    this.setupEventListeners(chatCardElement, normalizedChat, notificate);
  }

  private setupEventListeners(chatCardElement: Element, chat: TChat, notificate: boolean) {
    chatCardElement.addEventListener("click", (e) => {
      e.preventDefault();

      if (ChatStorage.getChat().chatId !== chat.chatId) {
        const newUrl = `/chat/${chat.chatId}`;
        history.pushState({ url: newUrl }, "", newUrl);

        if (ChatStorage.getChat().chatId) {
          const currentChat = document.querySelector(`[id='${ChatStorage.getChat().chatId}']`);
          if (currentChat) {
            currentChat.classList.remove('active');
          }
        }

        const currentChatCard = document.querySelector(`[id='${chat.chatId}']`);
        if (currentChatCard) {
          currentChatCard.classList.add('active');
        }
        
        if (notificate) {
          UserNotification.hide();
        }
        
        this.#chat.render(chat);
      }
    });

    chatCardElement.addEventListener("mouseover", () => {
      chatCardElement.classList.add('hover');
    });
    
    chatCardElement.addEventListener("mouseout", () => {
      chatCardElement.classList.remove('hover');
    });
  }
}