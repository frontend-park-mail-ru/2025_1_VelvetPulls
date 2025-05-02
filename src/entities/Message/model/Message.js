import { getAvatar } from "../../../shared/helpers/getAvatar.js";
import { api } from "../../../shared/api/api.js";
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
        let ch_id=this.chatId,mes_id=this.id

        let txts=doc.querySelectorAll(".message__content")
        let del_but=doc.querySelector(".message__delete")
        del_but.addEventListener("click", async function(){
            // console.log(del_but.parentNode.parentNode.parentNode)
            del_but.parentNode.parentNode.parentNode.remove()
            // console.log(ch_id,mes_id)
            await api.delete(`/chat/${ch_id}/messages/${mes_id}`)
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
                            textBlock.parentNode.querySelector(".message__delete").style.display="none"
                            // console.log(textBlock)
                            textBlock.innerHTML = newText; // Возвращаем новый текст в блок
                            // console.log(ch_id, mes_id, newText)
                            await api.put(`/chat/${ch_id}/messages/${mes_id}`,{
                                "message":newText,
                            })
                        }
                    });
                });
                
            });
        }
        this.element = element;

        return element;
    }

    // Статический метод для создания экземпляра из данных API
    static fromApi(data) {
        const message = new Message(data);
        // if (currentUserId) {
        //     message.setIsMine(currentUserId);
        // }
        return message;
    }
}
