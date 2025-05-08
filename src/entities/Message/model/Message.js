import { getAvatar } from "../../../shared/helpers/getAvatar.js";
import { api } from "../../../shared/api/api.js";
import { chatWebSocket } from "../../../shared/api/websocket.js";
import { currentUser } from "../../User/model/User.js";

export class Message {
    constructor({
        id,
        chat_id,
        user_id,
        body,
        sent_at,
        is_redacted = false,
        avatar_path = null,
        isMine = false,
        user = null,
    }) {
        this.id = id;
        this.chatId = chat_id;
        this.userId = user_id;
        this.body = body;
        this.sentAt = new Date(sent_at);
        this.isRedacted = is_redacted;
        this.avatarPath = avatar_path;
        this.isMine = isMine; // Флаг, указывающий, принадлежит ли сообщение текущему пользователю
        this.username = user;
    }

    // Форматирование времени для отображения
    getTime() {
        return this.sentAt.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });
    }

    // Форматирование даты для отображения (если нужно)
    getDate() {
        return this.sentAt.toLocaleDateString();
    }

    // Проверка, является ли сообщение "моим"
    setIsMine(currentUserId) {
        this.isMine = this.userId === currentUserId;
        return this;
    }

    // Обновление содержимого сообщения (например, при редактировании)
    updateBody(newBody) {
        this.body = newBody;
        this.isRedacted = true;
        return this;
    }

    // Преобразование в объект для API (если нужно отправить на сервер)
    toApiFormat() {
        return {
            id: this.id,
            chat_id: this.chatId,
            user_id: this.userId,
            body: this.body,
            sent_at: this.sentAt.toISOString(),
            is_redacted: this.isRedacted,
            avatar_path: this.avatarPath,
        };
    }

    async getElement(mode) {
        const data = {
            body: this.body,
            sentAt: this.getTime(),
            username: this.username,
            avatarSrc: await getAvatar(this.avatarPath),
            redact: this.isRedacted?"ред.":"",
        };

        let template = null;
        switch (mode) {
            case "my":
                template = Handlebars.templates["MyMessage.hbs"];
                break;

            case "dialog":
                template = Handlebars.templates["DialogMessage.hbs"];
                break;

            case "group":
                template = Handlebars.templates["GroupMessage.hbs"];
                break;
            case "channel":
                template = Handlebars.templates["ChannelPost.hbs"];
                break;

            default:
                throw Error("Задан некорректный тип сообщения");
        }

        const html = template({ ...data });

        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");
        const element = doc.body.firstChild;
        element.dataset.messageId = this.id; 
        let ch_id=this.chatId,mes_id=this.id

        let txts=doc.querySelectorAll(".message__content")
        let del_but=doc.querySelector(".message__delete")
        del_but.addEventListener("click", async function(){
            // Сначала отправляем запрос на удаление
            await api.delete(`/chat/${ch_id}/messages/${mes_id}`);
            
            // Затем отправляем WS-сообщение
            chatWebSocket.send({
                action: "deleteMessage",
                payload: {
                    messageId: mes_id
                }
            });
            // Визуальное удаление
            this.parentNode.parentNode.parentNode.remove();
        })
        if ((txts!==undefined)&&((this.username===currentUser.getUsername()))){
            // console.log(txts)
            // txts.style.cursor="pointer"
            txts.forEach(textBlock => {
                textBlock.style.cursor="pointer"
                textBlock.addEventListener('dblclick', function() {
                    //console.log(textBlock.parentNode.querySelector(".message__delete"))
                    textBlock.parentNode.querySelector(".message__delete").style.display="flex"
                    const currentText = textBlock.innerText;
                    const input = document.createElement('input');
                    
                    input.type = 'text';
                    input.value = currentText;
                    input.className="redact-mes"
            
                    // Заменяем блок текста на инпут
                    textBlock.innerHTML = '';
                    textBlock.appendChild(input);
                    input.focus();
            
                    // Обработчик для нажатия Enter
                    input.addEventListener('keypress', async function(event) {
                        if (event.key === 'Enter') {
                            const newText = input.value;
                            if (!((newText !== "")&&((newText.split(' ').length-1)!==newText.length))){
                                return
                            }
                            if (newText===currentText){
                                input.remove()
                                textBlock.innerHTML = newText;
                                return
                            }
                            textBlock.parentNode.querySelector(".message__delete").style.display="none"
                            // console.log(textBlock)
                            // Сначала отправляем на сервер
                            await api.put(`/chat/${ch_id}/messages/${mes_id}`, {
                                "message": newText,
                            });
                            
                            // Затем WS-событие
                            chatWebSocket.send({
                                action: "updateMessage",
                                payload: {
                                    chatId: ch_id,
                                    messageId: mes_id,
                                    newText: newText
                                }
                            });
                            
                            // Обновляем локально
                            textBlock.innerHTML = newText;
                        }
                    });
                });
                
            });
        }
        this.element = element;
        // this.messageContent = element.querySelector(".message__content");
        // this.deleteButton = element.querySelector(".message__delete");

        // if (this.username === currentUser.getUsername()) {
        //     this._setupEventHandlers();
        // }

        return element;
    }

    // _setupEventHandlers() {
    //     // Обработчик удаления сообщения
    //     if (this.deleteButton) {
    //         this.deleteButton.addEventListener("click", (e) => {
    //             e.stopPropagation();
    //             this._deleteMessage();
    //         });
    //         this.deleteButton.style.display = "none";
    //     }
    //     else{
    //         console.log("no delete button");
    //     }

    //     // Обработчик редактирования сообщения (по двойному клику)
    //     if (this.messageContent) {
    //         this.messageContent.style.cursor = "pointer";
    //         this.messageContent.addEventListener("dblclick", (e) => {
    //             e.stopPropagation();
    //             this._startEditing();
    //         });
    //     }
    // }

    // _startEditing() {
    //     if (!this.messageContent) return;

    //     const originalContent = this.messageContent.innerHTML;
    //     const input = document.createElement('input');
    //     input.value = this.body;
    //     input.className = "redact-mes";

    //     // Сохраняем ссылки на элементы
    //     const parent = this.messageContent.parentNode;
    //     const nextSibling = this.messageContent.nextSibling;
        
    //     // Заменяем содержимое
    //     parent.replaceChild(input, this.messageContent);
    //     if (this.deleteButton) this.deleteButton.style.display = "flex";

    //     const finish = async (save = true) => {
    //         if (this.deleteButton) this.deleteButton.style.display = "none";
            
    //         if (save && input.value.trim() !== this.body && input.value.trim() !== '') {
    //             await this._updateMessage(input.value.trim());
    //         }
            
    //         // Восстанавливаем оригинальный элемент
    //         const newContent = document.createElement('div');
    //         newContent.className = 'message__content';
    //         newContent.innerHTML = save ? this.body : originalContent;
    //         newContent.style.cursor = "pointer";
            
    //         if (nextSibling) {
    //             parent.insertBefore(newContent, nextSibling);
    //         } else {
    //             parent.appendChild(newContent);
    //         }
            
    //         input.remove();
    //         this.messageContent = newContent;
    //         this._setupEventHandlers(); // Перепривязываем обработчики
    //     };

    //     input.addEventListener('blur', () => finish(true));
    //     input.addEventListener('keydown', (e) => {
    //         if (e.key === 'Enter') finish(true);
    //         if (e.key === 'Escape') finish(false);
    //     });
        
    //     input.focus();
    // }

    // async _updateMessage(newText) {
    //     this.body = newText;
    //     this.isRedacted = true;
        
    //     // Отправка на сервер
    //     await api.put(`/chat/${this.chatId}/messages/${this.id}`, {
    //         message: newText
    //     });
        
    //     // WebSocket-уведомление
    //     chatWebSocket.send({
    //         action: "updateMessage",
    //         payload: {
    //             chatId: this.chatId,
    //             messageId: this.id,
    //             newText: newText
    //         }
    //     });
    // }

    // async _deleteMessage() {
    //     if (!this.element?.parentNode) return;
        
    //     // Визуальное удаление
    //     this.element.remove();
        
    //     // Отправка на сервер
    //     await api.delete(`/chat/${this.chatId}/messages/${this.id}`);
        
    //     // WebSocket-уведомление
    //     chatWebSocket.send({
    //         action: "deleteMessage",
    //         payload: {
    //             chatId: this.chatId,
    //             messageId: this.id
    //         }
    //     });
    // }

    // Статический метод для создания экземпляра из данных API
    static fromApi(data) {
        const message = new Message(data);
        // if (currentUserId) {
        //     message.setIsMine(currentUserId);
        // }
        return message;
    }
}
