import { API } from "@/shared/api/api.ts";
import { ChatsResponse, searchChatsResponse } from "@/shared/api/types";
import { TChat } from "@/entities/Chat";
import { ChatCard } from "@/entities/ChatCard";
import ChatListTemplate from "./ChatList.handlebars";
import "./ChatList.scss";
import { Chat } from "@/widgets/Chat/ui/Chat";
import { ContactsList } from "@/widgets/ContactsList";
import { AddGroupForm } from "@/widgets/AddGroupForm";
import { AddChannelForm } from "@/widgets/AddChannelForm";
import { debounce } from "@/shared/helpers/debounce";
import { ChatStorage } from "@/entities/Chat/lib/ChatStore";
import { ProfileForm } from "@/widgets/ProfileForm";

/**
 * ChatList class provides functions for rendering list of user's chats
 */
export class ChatList {
  #parent;
  #chat;

  constructor(parent: HTMLElement, chat: Chat) {
    this.#parent = parent;
    this.#chat = chat;
  }
  /**
   * Render ChatList widget
   * @function render
   * @async
   */
  async render() {
    const response = await API.get<ChatsResponse>("/chats");
    if (response.data!==null){
      response.chats=[]
      response.data.forEach(element => {
        response.chats.push({
          chatId: element.id,
          chatType: element.type,
          countOfUsers: element.count_users,
          chatName: element.title,
          avatarPath: element.avatar_path,
        })
      });
    }

    const chats: TChat[] = response.chats ?? [];

    this.#parent.innerHTML = ChatListTemplate({});

    const chatList : HTMLElement = this.#parent.querySelector("#chat-list")!;
    const chatCard = new ChatCard(chatList, this.#chat);

    chats.forEach((chat) => {
      chatCard.render(chat);
    });

    if (ChatStorage.getChat().chatId) {
      const chatCard : HTMLElement = document.querySelector(`[id='${ChatStorage.getChat().chatId}']`)!;
      if (chatCard) {
        chatCard.classList.add('active');
      }
    }

    const addChat = document.querySelector("#add-chat");
    const addChat1 = document.querySelector("#add-chat1");
    const addChatIcon = document.querySelector<HTMLElement>("#addChatIcon")!;
    const addChatIcon1 = document.querySelector<HTMLElement>("#addChatIcon1")!;
    const addChatPopup = document.querySelector<HTMLElement>("#addChatPopUp")!;
    const addChatPopup1 = document.querySelector<HTMLElement>("#addChatPopUp1")!;
    const toCon=addChatPopup1.querySelector<HTMLElement>("#contact-button1")!;
    const toProf=addChatPopup1.querySelector<HTMLElement>("#profile-button1")!;


    let degrees = 0;
    addChatIcon.addEventListener("click", (event) => {
      event.stopPropagation();
      addChatPopup.style.display = addChatPopup.style.display === "none" ? "flex" : "none";
      degrees += 45;
      addChatIcon.style.transform = 'rotate(' + degrees + 'deg)';
    });

    addChatIcon1.addEventListener("click", (event) => {
      event.stopPropagation();
      addChatPopup1.style.display = addChatPopup1.style.display === "none" ? "flex" : "none";
    });

    document.addEventListener("click", () => {
      if (addChatPopup.style.display !== "none") {
        addChatPopup.style.display = "none";
        degrees += 45;
        addChatIcon.style.transform = 'rotate(' + degrees + 'deg)';
      }
      if (addChatPopup1.style.display !== "none") {
        addChatPopup1.style.display = "none";
      }
    });

    addChat
      .querySelector("#create-personal-chat")!
      .addEventListener("click", () => {
        const contactForm = new ContactsList(this.#parent, this.#chat);
        document.querySelector("#chat-content").innerHTML=`<p class="chat-content__placeholder">
        Выберите чат
      </p>`
        contactForm.render();
      });
      toCon
      .addEventListener("click", () => {
        document.querySelector("#chat-content").innerHTML=`<p class="chat-content__placeholder">
        Выберите чат
      </p>`
        const contactForm = new ContactsList(this.#parent, this.#chat);
        contactForm.render();
      });
      toProf
      .addEventListener("click", () => {
        document.querySelector("#chat-content").innerHTML=`<p class="chat-content__placeholder">
        Выберите чат
      </p>`
        const contactForm = new ProfileForm(this.#parent,this.#chat);
        contactForm.render();
      });

    addChat
      .querySelector("#create-group-chat")!
      .addEventListener("click", () => {
        const addGroupForm = new AddGroupForm(this.#parent, this.#chat);
        document.querySelector("#chat-content").innerHTML=`<p class="chat-content__placeholder">
        Выберите чат
      </p>`
        addGroupForm.render();
      });

    const createChannelBtn = addChat.querySelector("#create-channel")!;

    const handelCreateChannel = () => {
      const addChannelForm = new AddChannelForm(this.#parent, this.#chat);
      document.querySelector("#chat-content").innerHTML=`<p class="chat-content__placeholder">
        Выберите чат
      </p>`
      addChannelForm.render();
    };
    createChannelBtn.addEventListener('click', handelCreateChannel);

    const searchInput : HTMLInputElement = this.#parent.querySelector("#search-input")!;

    const handleSearchChats = async () => {
      const searchChatsList : HTMLElement = this.#parent.querySelector('#search-chats-list')!;
      const searchUserChats : HTMLElement = searchChatsList.querySelector("#search-user-chats")!;
      const searchGlobalChats : HTMLElement = searchChatsList.querySelector("#search-globals-chats")!;
      const search_options=document.querySelector(".finder-options")
      searchUserChats.innerHTML = '';
      searchGlobalChats.innerHTML = '';
      
      const chatName = searchInput.value;
      if (chatName !== "") {

        const labelGlobalContacts : HTMLInputElement = searchChatsList.querySelector("#label-global-chats")!;
        const labelUserContacts : HTMLInputElement = searchChatsList.querySelector("#label-user-chats")!;

        const response = await API.get<searchChatsResponse>(`/search?query=${chatName}`);
        search_options?.classList.add("finder-options-visible")
        search_options?.querySelector("#finder-group").addEventListener("click", (event) => {
          event.preventDefault();
          searchUserChats.innerHTML = '';
          if (response.data.groups){
            response.user_chats=[]
            // response.user_chats[0].
            response.data.groups.forEach(element => {
              // response.global_channels[0].
              response.user_chats.push({
                chatId: element.id,
                chatName: element.title,
                chatType: "group",
              })
            });
            
            searchUserChats.innerHTML = '';
            labelUserContacts.style.display = "block";
            const userChats = new ChatCard(searchUserChats, this.#chat);
            response.user_chats.forEach((element) => {
              userChats.render(element);
            });
          }
        });
        search_options?.querySelector("#finder-dialog").addEventListener("click", (event) => {
          event.preventDefault();
          searchUserChats.innerHTML = '';
          if (response.data.dialogs){
            response.user_chats=[]
            // response.user_chats[0].
            response.data.dialogs.forEach(element => {
              // response.global_channels[0].
              response.user_chats.push({
                chatId: element.id,
                chatName: element.title,
                chatType: "dialog",
              })
            });
            
            searchUserChats.innerHTML = '';
            labelUserContacts.style.display = "block";
            const userChats = new ChatCard(searchUserChats, this.#chat);
            response.user_chats.forEach((element) => {
              userChats.render(element);
            });
          }
        });
        search_options?.querySelector("#finder-channel").addEventListener("click", (event) => {
          event.preventDefault();
          searchUserChats.innerHTML = '';
          if (response.data.global_channels){
            response.user_chats=[]
            // response.user_chats[0].
            response.data.global_channels.forEach(element => {
              // response.global_channels[0].
              response.user_chats.push({
                chatId: element.id,
                chatName: element.title,
                chatType: "channel",
              })
            });
            
            searchUserChats.innerHTML = '';
            labelUserContacts.style.display = "block";
            const userChats = new ChatCard(searchUserChats, this.#chat);
            response.user_chats.forEach((element) => {
              userChats.render(element);
            });
          }
        });
        // if (response.data.global_channels){
        //   response.global_channels=[]
        //   response.data.global_channels.forEach(element => {
        //     // response.global_channels[0].
        //     response.global_channels.push({
        //       chatId: element.id,
        //       chatName: element.title,
        //       chatType: "channel",
        //     })
        //   });
        // }
        // if (response.data.groups){
        //   response.user_chats=[]
        //   // response.user_chats[0].
        //   response.data.groups.forEach(element => {
        //     // response.global_channels[0].
        //     response.user_chats.push({
        //       chatId: element.id,
        //       chatName: element.title,
        //       chatType: "group",
        //     })
        //   });
        // }
        if (!response.error) {
          chatList.style.display = "none";
          searchChatsList.style.display = "block";
          if (response.user_chats) {
            searchUserChats.innerHTML = '';
            labelUserContacts.style.display = "block";
            const userChats = new ChatCard(searchUserChats, this.#chat);
            response.user_chats.forEach((element) => {
              userChats.render(element);
            });
          }
          else {
            labelUserContacts.style.display = "none";
          }
          if (response.global_channels) {
            searchGlobalChats.innerHTML = '';
            labelGlobalContacts.style.display = "block";
            const globalChats = new ChatCard(searchGlobalChats, this.#chat);
            response.global_channels.forEach((element) => {
              globalChats.render(element);
            });
          }
          else{
            labelGlobalContacts.style.display = "none";
          }
        }
      }
      else {
        searchChatsList.style.display = "none";
        chatList.style.display = "block";
        search_options?.classList.remove("finder-options-visible")
      }
      return;
    };
    const debouncedHandle = debounce(handleSearchChats, 250);

    searchInput.addEventListener("input", debouncedHandle);

    document.querySelector<HTMLElement>('#chat-info-container')!.style.right = '-100vw'; 
    this.#parent.style.left = '0';

  }
}
