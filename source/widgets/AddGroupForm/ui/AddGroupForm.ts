import { API } from "@/shared/api/api";
import AddGroupTemplate from "./AddGroupForm.handlebars";
import "./AddGroupForm.scss";
import { ContactResponse, NewChatRequest } from "@/shared/api/types";
import { ContactCard } from "@/entities/ContactCard/ui/ContactCard";
import { validateNickname } from "@/shared/validation/nicknameValidation";
import { validateForm } from "@/shared/validation/formValidation";
import { Chat } from "@/widgets/Chat";
import { ChatList } from "@/widgets/ChatList";
import { SelectedContacts } from "../lib/SelectedContacts";
import { UserStorage } from "@/entities/User";
export class AddGroupForm {
  #parent;
  #chat;

  constructor(parent: Element, chat: Chat) {
    this.#parent = parent;
    this.#chat = chat;
  }

  async render() {
    this.#parent.innerHTML = AddGroupTemplate();

    const avatarRender: HTMLImageElement =
      this.#parent.querySelector("#avatar")!;
    avatarRender.src = "/assets/image/default-avatar.svg";
    const avatarInput: HTMLInputElement = this.#parent.querySelector("#ava")!;
    let avatarFile: File;
    const handleAvatar = () => {
      if (avatarInput.files) {
        const file = avatarInput.files[0];
        if (file) {
          avatarRender.src = URL.createObjectURL(file);
          avatarFile = file;
        }
      }
    };
    avatarInput.addEventListener("change", handleAvatar);

    const selectedContacts = new SelectedContacts();

    const response = await API.get<ContactResponse>("/contacts");
    const contactList = this.#parent.querySelector("#contacts-list")!;
    const contactCard = new ContactCard(contactList);

    if (!response.error) {
      const contacts = response.data;

      if (contacts) {
        contacts.forEach((element) => {
          contactCard.renderForm(element, selectedContacts);
        });
      }
    }

    const updateProfileInfo = async () => {
      const nameInput: HTMLInputElement =
        this.#parent.querySelector("#user-name")!;

      const chatName: string = nameInput.value;

      const newChat: NewChatRequest = {
        title: chatName,
        type: "group",
        usersToAdd: selectedContacts.getSelectedContacts(),
      };
      newChat.usersToAdd.push(UserStorage.getUser().username);

      const chatNameRender: HTMLSpanElement =
        this.#parent.querySelector("#nickname")!;
      if (!validateNickname(newChat.title) || newChat.title.length > 20) {
        validateForm(nameInput, "Не валидное название", chatNameRender);
        return;
      } else {
        chatNameRender.textContent = "";
      }

      if (selectedContacts.getSelectedContacts().length === 0) {
        validateForm(
          nameInput,
          "Выберите хотя бы одного участника для создания группы  ",
          chatNameRender,
        );
        return;
      } else {
        chatNameRender.textContent = "";
      }

      const formData: FormData = new FormData();
      const jsonProfileData = JSON.stringify(newChat);
      formData.append("chat_data", jsonProfileData);
      formData.append("avatar", avatarFile);

      // const newChatRes = await API.postFormData<ChatResponse>(
      //   "/addchat",
      //   formData,
      // );
      // const responseSubscribe = await API.post("/chat", newChat);
      //  Router.go("/")

      const chatList = new ChatList(this.#parent, this.#chat);
      chatList.render();
    };

    const confirmButton = this.#parent.querySelector("#confirm-button");
    confirmButton?.addEventListener("click", updateProfileInfo);

    const backButton = this.#parent.querySelector("#back-button")!;

    const handleBack = () => {
      const chatList = new ChatList(this.#parent, this.#chat);
      chatList.render();
    };

    backButton.addEventListener("click", handleBack);
  }
}
