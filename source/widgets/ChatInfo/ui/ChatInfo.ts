import { API } from "@/shared/api/api";
import ChatInfoTemplate from "./ChatInfo.handlebars";
import "./ChatInfo.scss";
import { UserStorage } from "@/entities/User";
import { serverHost, staticHost } from "@/app/config";
import { TChat } from "@/entities/Chat";
import { ChatResponse, ProfileResponse, UsersIdResponse } from "@/shared/api/types";
import { Router } from "@/shared/Router/Router";
import { ChatStorage } from "@/entities/Chat/lib/ChatStore";
import { formatBytes } from "@/shared/helpers/formatBytes";
import { ChatList } from "@/widgets/ChatList";

export class ChatInfo {
  #parent;
  #chat;
  constructor(parent: HTMLElement, chat: TChat) {
    this.#parent = parent;
    this.#chat = chat;
  }

  async render() {
    const usersInChat = await API.get<UsersIdResponse>(
      `/chat/${this.#chat.chatId}`,
    );
    let user;
    if (usersInChat.data.users) {
      user = usersInChat.data.users[(usersInChat.data.users[0].id !== UserStorage.getUser().id) ? 0 : 1];
      const profileUser = await API.get<ProfileResponse>(`/profile/${user.username}`);
      let birthdate;
      if (profileUser.birthdate) {
        const bhd = new Date(profileUser.birthdate);
        birthdate = `${bhd.getUTCFullYear()}-${bhd.getUTCMonth()+1}-${bhd.getUTCDate()}`;
      }
       
      if (profileUser.data.avatar_path) {
        profileUser.avatarURL = staticHost + profileUser.data.avatar_path;
      } else {
        profileUser.avatarURL = "/assets/image/default-avatar.svg";
      }

      const chatInfo = await API.get<ChatResponse>(`/chat/${this.#chat.chatId}`);
      const extentionRegex = /\.([^.]+)$/;
      const nameRegex = /^(.+)\.[^.]+$/;

      // Собираем все файлы и фото из сообщений
      const allFiles: any[] = [];
      const allPhotos: any[] = [];

      if (chatInfo.data?.messages) {
        for (const message of chatInfo.data.messages) {
          if (message.files && message.files.length > 0) {
            allFiles.push(...message.files);
          }
          if (message.photos && message.photos.length > 0) {
            allPhotos.push(...message.photos);
          }
        }
      }

      // Функция для форматирования размера файла
      const formatBytes = (bytes: number, decimals = 2): string => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
      };

      // Подготавливаем данные для шаблона
      const formattedFiles = allFiles.map(file => ({
        URL: `${serverHost}${file.URL}`,
        name: nameRegex.exec(file.Filename)?.[1] || file.Filename,
        extention: extentionRegex.exec(file.Filename)?.[1]?.toUpperCase() || 'FILE',
        Size: formatBytes(file.Size),
      }));

      const formattedPhotos = allPhotos.map(photo => ({
        URL: `${serverHost}${photo.URL}`
      }));

      this.#parent.innerHTML = ChatInfoTemplate({ 
        profileUser, 
        birthdate,
        chat: {
          files: formattedFiles,
          photos: formattedPhotos,
        },
      });

      const photosButton = this.#parent.querySelector<HTMLElement>("#group-content-photos")!;
      const filesButton = this.#parent.querySelector<HTMLElement>("#group-content-files")!;

      const contentImport = this.#parent.querySelector<HTMLElement>("#content-tabs")!;

      photosButton?.addEventListener('click', () => {
      contentImport.style.transform = `translateX(0%)`;
      });
      filesButton?.addEventListener('click', () => {
      contentImport.style.transform = `translateX(-100%)`;
      });   

      const deleteChatButton = this.#parent.querySelector("#delete-chat")!;

      const handleDeleteGroup = async () => {
        const response = await API.delete(
          `/chat/${this.#chat.chatId}`,
          this.#chat.chatId,
        );
        // console.log(response)
        // if (!response.error) {
          // console.log("dele")
          Router.go("/");
          const chatList = new ChatList(this.#parent, this.#chat);
                  chatList.render();
        //}
      };

      deleteChatButton.addEventListener("click", handleDeleteGroup);
    }

    this.#parent.querySelector('#chat-info-close-button')!.addEventListener('click', () => {
      this.#parent.style.right = '-100vw';
      this.#parent.innerHTML = '';
    });

    this.#parent.style.right = '0';

    const notificationToggle = this.#parent.querySelector("#notification-toggle")!;
    const notificationCheckbox : HTMLInputElement = this.#parent.querySelector("#toggle")!;
    if (ChatStorage.getChat().send_notifications) {
      notificationCheckbox.checked = true;
      notificationToggle.checked = true;
    }


    const handleNotification = async () => {
      await API.post(`/chat/${ChatStorage.getChat().chatId}/notifications/${!notificationCheckbox.checked}`, {});
    };

    notificationToggle.addEventListener("click", handleNotification);
  }
}
