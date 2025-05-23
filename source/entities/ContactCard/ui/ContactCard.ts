import ContactCardTemplate from "./ContactCard.handlebars";
import { TContact } from "../api/ContactType";
import "./ContactCard.scss";
import { staticHost } from "@/app/config";
import { TChat } from "@/entities/Chat";
import { ChatResponse, ChatsResponse } from "@/shared/api/types";
import { API } from "@/shared/api/api";
import { Chat } from "@/widgets/Chat";
import { TNewChat } from "@/entities/Chat/model/type";
import { SelectedContacts } from "@/widgets/AddGroupForm/lib/SelectedContacts";
import { ChatList } from "@/widgets/ChatList";

export class ContactCard {
  #parent;

  constructor(parent: Element) {
    this.#parent = parent;
  }

  render(contact: TContact) {
    if (contact.avatarURL !== null && contact.avatarURL !== undefined) {
      contact.avatarURL = staticHost + contact.avatarURL;
    } else {
      contact.avatarURL = "/assets/image/default-avatar.svg";
    }
    this.#parent.insertAdjacentHTML(
      "beforeend",
      ContactCardTemplate({
        contact,
      }),
    );

    this.#parent.lastElementChild!.addEventListener("click", (event) => {
      event.preventDefault();
    });
  }

  renderChat(contact: TContact, chat: Chat, chatList: ChatList) {
    if (contact.avatarURL !== null && contact.avatarURL !== undefined) {
      contact.avatarURL = staticHost + contact.avatarURL;
    } else {
      contact.avatarURL = "/assets/image/default-avatar.svg";
    }

    this.#parent.insertAdjacentHTML(
      "beforeend",
      ContactCardTemplate({ contact }),
    );

    this.#parent.lastElementChild!.addEventListener("click", async (e) => {
      e.preventDefault();
      const response = await API.get<ChatsResponse>("/chats");
      if (response.data !== null) {
        response.chats = [];
        response.data.forEach((element) => {
          response.chats.push({
            chatId: element.id,
            chatType: element.type,
            countOfUsers: element.count_users,
            chatName: element.title,
            send_notifications: element.send_notifications,
          });
        });
      }

      // if (!response.chats) {
      //   return;
      // }
      const chats: TChat[] = response.chats ?? [];

      for (const elem of chats) {
        if (elem.chatType === "dialog") {
          const chatResponse = await API.get<ChatResponse>(
            `/chat/${elem.chatId}`,
          );
          if (
            chatResponse.users &&
            chatResponse.users.find((user) => user.id === contact.id)
          ) {
            chatList.render();
            chat.render(elem);
            return;
          }
        }
      }

      const newChat: TNewChat = {
        title: contact.username,
        type: "dialog",
        usersToAdd: [contact.username],
      };

      const formData: FormData = new FormData();
      const jsonProfileData = JSON.stringify(newChat);
      formData.append("chat_data", jsonProfileData);

      // const newChatRes = await API.postFormData<ChatResponse>(
      //   "/addchat",
      //   formData,
      // );
      const responseSubscribe = await API.post("/chat", newChat);

      // if (!newChatRes.error) {
      chatList.render();
      // const responseInfo = await API.get<ChatResponse>(
      //   `/chat/${responseSubscribe.data.id}`,
      // );
      // {
      //   chatId: responseSubscribe.data.id,
      //   chatType: responseSubscribe.data.type,
      //   countOfUsers: responseSubscribe.data.count_users,
      //   chatName: responseSubscribe.data.title,
      // }
      chat.render({
        chatId: responseSubscribe.data.id,
        chatType: responseSubscribe.data.type,
        countOfUsers: responseSubscribe.data.count_users,
        chatName: responseSubscribe.data.title,
      });
      // }
    });
  }

  renderForm(contact: TContact, selectedContacts: SelectedContacts) {
    if (contact.avatarURL && contact.avatarURL !== undefined) {
      contact.avatarURL = staticHost + contact.avatarURL;
    } else {
      contact.avatarURL = "/assets/image/default-avatar.svg";
    }
    this.#parent.insertAdjacentHTML(
      "beforeend",
      ContactCardTemplate({
        contact: {
          ...contact,
          form: true,
        },
      }),
    );

    const checkbox = this.#parent.lastElementChild!.querySelector(
      ".contact-card-checkbox",
    )!;
    const checkedIcon = checkbox.querySelector<HTMLElement>(
      ".contact-card-unchecked",
    )!;
    const uncheckedIcon = checkbox.querySelector<HTMLElement>(
      ".contact-card-checked",
    )!;

    this.#parent.lastElementChild!.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();

      selectedContacts.toggleCheckbox(contact.username);

      checkedIcon.style.display =
        checkedIcon.style.display === "none" ? "inline" : "none";
      uncheckedIcon.style.display =
        uncheckedIcon.style.display === "none" ? "inline" : "none";
    });
  }
}
