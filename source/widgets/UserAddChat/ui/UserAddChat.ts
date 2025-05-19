import { TChat } from "@/entities/Chat";
import UserAddChatTemplate from "./UserAddChat.handlebars";
import "./UserAddChat.scss";
import { API } from "@/shared/api/api";
import {
  AddUserResponse,
  ContactResponse,
  UsersIdRequest,
  UsersIdResponse,
} from "@/shared/api/types";
import { ContactCard } from "@/entities/ContactCard/ui/ContactCard";
import { TContact } from "@/entities/ContactCard";

export class UserAddChat {
  #parent;
  constructor(parent: Element) {
    this.#parent = parent;
  }

  async render(chat: TChat, chatUsersList: Element, usersCount: Element) {
    this.#parent.innerHTML = UserAddChatTemplate();

    const cancelBtn = this.#parent.querySelector("#cancel-btn")!;

    const handleCancelButton = () => {
      this.#parent.innerHTML = "";
    };

    cancelBtn.addEventListener("click", handleCancelButton);

    const contactListContainer =
      this.#parent.querySelector("#chat-contact-list")!;
    const response = await API.get<ContactResponse>("/contacts");
    response.contacts=response.data
    if (!response.error) {
      const contacts = response.contacts;
      if (contacts && contacts.length) {
        contacts.forEach((elem) => {
          const contact = new ContactCard(contactListContainer);
          contact.render(elem);
        });
      }
    }

    const contactCardElement = document.querySelectorAll(".contact-card");
    contactCardElement.forEach((elem) => {
      elem.addEventListener("click", async (e) => {
        const users: string[] = [];
        if (elem instanceof HTMLAnchorElement) {
          console.log(elem.querySelector(".contact-card-name")?.innerHTML.replaceAll(' ',''))
          const index = elem.href.lastIndexOf("/");
          const href = elem.href.slice(index + 1);
          users.push(elem.querySelector(".contact-card-name")?.innerHTML.replaceAll(' ','').replaceAll('\n',''));
        }

        e.preventDefault();
        const response = await API.post<AddUserResponse, UsersIdRequest>(
          `/chat/${chat.chatId}/users`,
          { users },
        );
        if (!response.error) {
          this.#parent.innerHTML = "";
          const ChatUsersId = await API.get<UsersIdResponse>(
            `/chat/${chat.chatId}`,
          );
          if (ChatUsersId.data) {
            chatUsersList.innerHTML = "";
            const userCard = new ContactCard(chatUsersList);
            ChatUsersId.data.users.forEach(async (element) => {
              const user: TContact = {
                id: element.id,
                name: element.username,
                avatarURL: element.avatarURL,
                username: element.username,
              };
              userCard.render(user);
            });
            usersCount.innerHTML = ChatUsersId.data.users.length.toString();
          }
        }
      });
    });

    const handlerClickOutsideModal = (e: Event) => {
      if (e.target instanceof Element) {
        if (e.target.className === "add-user-to-chat") {
          this.#parent.innerHTML = "";
        }
      }
    };

    document.addEventListener("click", handlerClickOutsideModal);
  }
}
