import { ChatList } from "@/widgets/ChatList";
import { Chat } from "@/widgets/Chat";
import { API } from "@/shared/api/api.ts";
import { ChatsResponse } from "@/shared/api/types";
import MainPageTemplate from "./MainPage.handlebars";
import "./MainPage.scss";
import { View } from "@/app/View";
import { TUser, UserStorage } from "@/entities/User";
import { ProfileForm } from "@/widgets/ProfileForm";
import { ContactsList } from "@/widgets/ContactsList";
import { wsConn } from "@/shared/api/ws";
import { TChat } from "@/entities/Chat";
import { newChat, renderMessage, renderMessage1, renderMessage2 } from "./handlers";
import { serverHost, staticHost } from "@/app/config";
import { UserNotification } from "@/feature/Notification";

/**
 * Mainpage class provides functions for rendering main page
 */
export class MainPage extends View {
  constructor() {
    super();
  }
  /**
   * Render MainPage
   * @function render
   * @async
   */
  async render(chatid: string | null = null) {
    const user: TUser = UserStorage.getUser();

    const parent = document.getElementById("root")!;
    let avatar: string;
    if (user.avatarURL) {
      avatar = staticHost + user.avatarURL;
    } else {
      avatar = "/assets/image/default-avatar.svg";
    }

    document.body.id = 'main';
    parent.innerHTML = MainPageTemplate({ user, avatar });

    UserNotification.render();

    const chatUserInfo : HTMLElement = parent.querySelector("#chat-info-container")!;
    const chatListParent : HTMLElement = parent.querySelector("#widget-import")!;

    const chatParent = parent.querySelector("#chat-content")!;
    const chat = new Chat(chatParent, chatUserInfo);

    const chatList = new ChatList(chatListParent, chat);
    chatList.render();

    if (chatid) {
      let chats: TChat[] = [];
      const response = await API.get<ChatsResponse>("/chats");
      if (response.chats) {
        chats = response.chats;
        const index = chats.findIndex((elem) => chatid === elem.chatId);

        if (index !== -1) {
          chat.render(chats[index]);
        } else {
          history.pushState({ url: "/" }, "", "/");
        }
      }
    }
    wsConn.unsubscribe("newMessage", renderMessage);
    wsConn.unsubscribe("updateMessage", renderMessage1);
    wsConn.unsubscribe("deleteMessage", renderMessage2);

    wsConn.subscribe("newMessage", renderMessage);
    wsConn.subscribe("updateMessage", renderMessage1);
    wsConn.subscribe("deleteMessage", renderMessage2);
    // wsConn.subscribe("newChat", newChat);
  }
}
