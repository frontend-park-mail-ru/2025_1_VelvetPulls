import {
  TChatMessage,
  TChatMessageWithFlags,
} from "@/entities/ChatMessage/model/type";
import ChatMessageTemplate from "./ChatMessage.handlebars";
import "./ChatMessage.scss";
import { UserStorage } from "@/entities/User";
import { getTimeString } from "@/shared/helpers/getTimeString";
import { serverHost } from "@/app/config";
import { ChatStorage } from "@/entities/Chat/lib/ChatStore";
import { API } from "@/shared/api/api";
import { MessageMenu } from "@/widgets/MessageMenu/ui/MessageMenu.ts";
import { ChatMessagesResponse, createBranchResponse, EmptyRequest } from "@/shared/api/types";
import { messageHandler } from "../api/MessageHandler";
import { formatBytes } from "@/shared/helpers/formatBytes";
import { InfoMessage } from "@/entities/InfoMessage/ui/InfoMessage";

export class ChatMessage {
  #parent;
  #needNewMsg;
  #oldestMessage: TChatMessageWithFlags | null = null;
  #newestMessage: TChatMessageWithFlags | null = null;

  constructor(parent: HTMLElement) {
    this.#parent = parent;

    let nextPageLoading = false;
    this.#needNewMsg=true;
    this.#parent.addEventListener('scroll', () => { 
      //messages.clientHeight+messages.scrollTop+5>messages.scrollHeight
      // console.log(this.#parent.offsetHeight, this.#parent.scrollTop , this.#parent.scrollHeight-2) 
      if (this.#parent.offsetHeight - this.#parent.scrollTop >= this.#parent.scrollHeight-2) {

        if (nextPageLoading) {
          return;
        }
        nextPageLoading = true; 
        
        if(true){
          // console.log(document.querySelector(".messages")?.lastElementChild.id)
          API.get<ChatMessagesResponse>(
            `/chat/${ChatStorage.getChat().chatId}/messages/up/${document.querySelector(".messages").lastElementChild.id}`,
          ).then((res) => {
            // console.log(document.querySelector(".messages").lastElementChild)
            // console.log(res)
            let arr=[]
            res.data.forEach(element => {
              arr.push({
                text: element.body,
                chatId: element.chat_id,
          messageId: element.id,
          datetime: element.sent_at,
          text: element.body,
          authorID: element.user,
          isRedacted: element.is_redacted,
              })
            })
            res.messages=arr
            const msgs=document.querySelector(".messages")
            // res.messages.forEach(element => {
            //   msgs.removeChild(msgs.querySelector(".message"))
            // });
            // document.querySelector(".messages").innerHTML=""
            if(res.messages && res.messages.length > 0){
              // console.log(res.messages)
              // this.#parent.scrollTop=-this.#parent.offsetHeight
              this.renderMessages(res.messages);
              // this.#parent.scrollTop=-this.#parent.offsetHeight

              res.messages.forEach(element => {
                msgs.removeChild(msgs.querySelector(".message"))
              });
              this.#needNewMsg=false
            }
            nextPageLoading = false;
          }).catch(() => {
            nextPageLoading = false;
          });
        }
      }
      if (this.#parent.scrollTop===0){
        // console.log(document.querySelector(".message").id)
        API.get<ChatMessagesResponse>(
          `/chat/${ChatStorage.getChat().chatId}/messages/down/${document.querySelector(".message").id}`,
        ).then((res) => {
          // console.log(res.data)
          let arr=[]
          res.data.forEach(element => {
            arr.push({
              text: element.body,
              chatId: element.chat_id,
        messageId: element.id,
        datetime: element.sent_at,
        text: element.body,
        authorID: element.user,
        isRedacted: element.is_redacted,

            })
          });
          res.messages=arr
          // document.querySelector(".messages").innerHTML=""
          if(res.messages && res.messages.length > 0){
            this.renderMessages1(res.messages);
            let c=res.messages.length
            for (let i=0;i<c;i++){
              const msgs1=document.querySelector(".messages")
              msgs1.removeChild(msgs1.lastElementChild)
            }
            if (c<25){
              this.#needNewMsg=true
            }
            // res.messages.forEach(element => {
            //   console.log("msgs1.lastElementChild()")
            //   // msgs1.removeChild(msgs1.lastElementChild())
            // });
          }
        //   nextPageLoading = false;
        }).catch(() => {
          // nextPageLoading = false;
        });
      }  
    });
  }

  async renderMessages(messages: TChatMessage[], chatIsNotBranch = true) {
    // console.log(messages);
    if ( 
      this.#parent.innerHTML &&
      this.#oldestMessage?.first &&
      this.#oldestMessage.authorID === messages[0].authorID
    ) {
      this.#parent.lastElementChild!.classList.remove("first-message");
    }

    for (const [index, message] of messages.entries()) {
      const isFirst =
          index === messages.length - 1 ||
          message.authorID !== messages[index + 1].authorID;
        const isLast =
          !this.#oldestMessage || this.#oldestMessage.authorID !== message.authorID;
        const isFromOtherUser = message.authorID !== UserStorage.getUser().username;

        const messageWithFlags: TChatMessageWithFlags = {
          ...message,
          first: isFirst,
          last: isLast,
          isFromOtherUser: isFromOtherUser,
        };
        // console.log(messageWithFlags)

        this.#oldestMessage = messageWithFlags;
      if (message.message_type === undefined || message.message_type === "with_payload" || message.message_type === "sticker") {
        

        if (!this.#newestMessage) {
          this.#newestMessage = messageWithFlags;
        }

        const user = ChatStorage.getUsers().find(user => user.username === message.authorID)!;
        const avatarURL = user.avatarURL
          ? serverHost + user.avatarURL
          : "/assets/image/default-avatar.svg";
      
      const photos = message.photos ? message.photos.map(photo => ({
        url: `${serverHost}${photo.url}`
      })) : [];

      const extentionRegex = /\.([^.]+)$/;
      const nameRegex = /^(.+)\.[^.]+$/;

      const files = message.files ? message.files.map(file => ({
        url: `${serverHost}${file.url}`,
        name: nameRegex.exec(file.filename)![1],
        extention: extentionRegex.exec(file.filename)![1].toUpperCase(),
        size: formatBytes(file.size)
      })) : [];
    //   console.log({
    //     ...messageWithFlags,
    //     datetime: getTimeString(messageWithFlags.datetime),
    //     avatarURL: avatarURL,
    //     authorName: user?.username,
    //     photos: photos,
    //     files: files,
    //     sticker: message.sticker ? `${serverHost}${message.sticker}` : "",
    // },)

        this.#parent.insertAdjacentHTML(
          "beforeend",
          ChatMessageTemplate({
            message: {
              ...messageWithFlags,
              datetime: getTimeString(messageWithFlags.datetime),
              avatarURL: avatarURL,
              authorName: user?.username,
              photos: photos,
              files: files,
              sticker: message.sticker ? `${serverHost}${message.sticker}` : "",
          },
            chatIsNotBranch
          }),
        );
        // console.log(message)
        if (message.isRedacted) {
          const redactedMessage = this.#parent.querySelector(`[id='${message.messageId}']`)!.querySelector("#redacted");
          if (redactedMessage) {
            redactedMessage.classList.remove("hidden");
          }
        }
        
        const currentMessageId = this.#parent.lastElementChild!.id;
        messageHandler(currentMessageId, messages, this);
      }
      if (message.message_type === "informational") {
        const infoMessage = new InfoMessage(this.#parent);
        infoMessage.render(message);
      }
    }
  }

  async renderMessages1(messages: TChatMessage[], chatIsNotBranch = true) {
    // console.log(messages);
    if ( 
      this.#parent.innerHTML &&
      this.#oldestMessage?.first &&
      this.#oldestMessage.authorID === messages[0].authorID
    ) {
      this.#parent.lastElementChild!.classList.remove("first-message");
    }

    for (const [index, message] of messages.entries()) {
      const isFirst =
          index === messages.length - 1 ||
          message.authorID !== messages[index + 1].authorID;
        const isLast =
          !this.#oldestMessage || this.#oldestMessage.authorID !== message.authorID;
        const isFromOtherUser = message.authorID !== UserStorage.getUser().username;

        const messageWithFlags: TChatMessageWithFlags = {
          ...message,
          first: isFirst,
          last: isLast,
          isFromOtherUser: isFromOtherUser,
        };
        // console.log(messageWithFlags)

        this.#oldestMessage = messageWithFlags;
      if (message.message_type === undefined || message.message_type === "with_payload" || message.message_type === "sticker") {
        

        if (!this.#newestMessage) {
          this.#newestMessage = messageWithFlags;
        }

        const user = ChatStorage.getUsers().find(user => user.username === message.authorID)!;
        const avatarURL = user.avatarURL
          ? serverHost + user.avatarURL
          : "/assets/image/default-avatar.svg";
      
      const photos = message.photos ? message.photos.map(photo => ({
        url: `${serverHost}${photo.url}`
      })) : [];

      const extentionRegex = /\.([^.]+)$/;
      const nameRegex = /^(.+)\.[^.]+$/;

      const files = message.files ? message.files.map(file => ({
        url: `${serverHost}${file.url}`,
        name: nameRegex.exec(file.filename)![1],
        extention: extentionRegex.exec(file.filename)![1].toUpperCase(),
        size: formatBytes(file.size)
      })) : [];
    //   console.log({
    //     ...messageWithFlags,
    //     datetime: getTimeString(messageWithFlags.datetime),
    //     avatarURL: avatarURL,
    //     authorName: user?.username,
    //     photos: photos,
    //     files: files,
    //     sticker: message.sticker ? `${serverHost}${message.sticker}` : "",
    // },)

        this.#parent.insertAdjacentHTML(
          "afterbegin",
          ChatMessageTemplate({
            message: {
              ...messageWithFlags,
              datetime: getTimeString(messageWithFlags.datetime),
              avatarURL: avatarURL,
              authorName: user?.username,
              photos: photos,
              files: files,
              sticker: message.sticker ? `${serverHost}${message.sticker}` : "",
          },
            chatIsNotBranch
          }),
        );

        const newMessageElement = document.getElementById(message.messageId)!;
      const handleMessageClick = (event : MouseEvent) => {
        
        const messageId = newMessageElement.id;
        const messageInChat = document.getElementById(messageId)!;
        if (message) {
          const menu = messageInChat.querySelector("#menu-context")!;
          const messageText = messageInChat.querySelector("#message-text-content")?.textContent;
          const messageMenu = new MessageMenu(menu);
          if (messageText) {
            console.log("hihihi")
            if (ChatStorage.getCurrentBranchId()) {
              messageMenu.render(message, messageId, messageText, event.x-100, event.y-25, this, true);
              return;
            }
            messageMenu.render(message, messageId, messageText, event.x-100, event.y-25, this, false);
          }
        }
      };

      
      newMessageElement.addEventListener("contextmenu", handleMessageClick);

        // console.log(message)
        if (message.isRedacted) {
          const redactedMessage = this.#parent.querySelector(`[id='${message.messageId}']`)!.querySelector("#redacted");
          if (redactedMessage) {
            redactedMessage.classList.remove("hidden");
          }
        }
        
        const currentMessageId = this.#parent.lastElementChild!.id;
        messageHandler(currentMessageId, messages, this);
      }
      if (message.message_type === "informational") {
        const infoMessage = new InfoMessage(this.#parent);
        infoMessage.render(message);
      }
    }
  }

  async renderNewMessage(message: TChatMessage, chatIsNotBranch = true) {
    const placeholder= this.#parent.querySelector('#msg-placeholder');
        console.log(this.#needNewMsg)
        if (!this.#needNewMsg){
          return
        }

    // console.log(message)
    if(placeholder) {
      placeholder.remove();
    }
    if (message.text || message.sticker) {
      if (
        this.#newestMessage?.last &&
        this.#newestMessage.authorID === message.authorID
      ) {
        if (this.#parent.firstElementChild) {
          this.#parent.firstElementChild!.classList.remove("last-message");
        }
      }

      const isFromOtherUser = message.authorID !== UserStorage.getUser().username;

      const messageWithFlags: TChatMessageWithFlags = {
        ...message,
        first:
          !this.#newestMessage ||
          this.#newestMessage.authorID !== message.authorID,
        last: true,
        isFromOtherUser: isFromOtherUser,
      };

      this.#newestMessage = messageWithFlags;

      const user = ChatStorage.getUsers().find(user => user.username === message.authorID)!;
      const avatarURL = user.avatarURL
        ? serverHost + user.avatarURL
        : "/assets/image/default-avatar.svg";

      const photos = message.photos ? message.photos.map(photo => ({
        url: `${serverHost}${photo.url}`
      })) : [];

      const extentionRegex = /\.([^.]+)$/;
      const nameRegex = /^(.+)\.[^.]+$/;

      const files = message.files ? message.files.map(file => ({
        url: `${serverHost}${file.url}`,
        name: nameRegex.exec(file.filename)![1],
        extention: extentionRegex.exec(file.filename)![1].toUpperCase(),
        size: formatBytes(file.size)
      })) : [];
    
      if (ChatStorage.getCurrentBranchId()) {
        chatIsNotBranch = false;
      }  
      this.#parent.insertAdjacentHTML(
        "afterbegin",
        ChatMessageTemplate({
          message: {
            ...messageWithFlags,
            datetime: getTimeString(messageWithFlags.datetime),
            avatarURL: avatarURL,
            authorName: user?.username,
            photos: photos,
            files: files,
            sticker: message.sticker ? `${serverHost}${message.sticker}` : "",
          },
          chatIsNotBranch
        }),
      );

      if (message.isRedacted) {
        const redactedMessage = this.#parent.querySelector("#redacted")!;
        if (redactedMessage) {
          redactedMessage.classList.remove("redacted");
        }
      }

      const newMessageElement = document.getElementById(message.messageId)!;
      const handleMessageClick = (event : MouseEvent) => {
        
        const messageId = newMessageElement.id;
        const messageInChat = document.getElementById(messageId)!;
        if (message) {
          const menu = messageInChat.querySelector("#menu-context")!;
          const messageText = messageInChat.querySelector("#message-text-content")?.textContent;
          const messageMenu = new MessageMenu(menu);
          if (messageText) {
            console.log("hihihi")
            if (ChatStorage.getCurrentBranchId()) {
              messageMenu.render(message, messageId, messageText, event.x-100, event.y-25, this, true);
              return;
            }
            messageMenu.render(message, messageId, messageText, event.x-100, event.y-25, this, false);
          }
        }
      };

      
      newMessageElement.addEventListener("contextmenu", handleMessageClick);
    }
  }

  getParent() {
    return this.#parent;
  }
  
  setParent(newParent : HTMLElement) {
    this.#parent = newParent;
  }
}