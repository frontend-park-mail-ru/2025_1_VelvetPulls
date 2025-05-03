import { eventBus } from "../../../shared/modules/EventBus/EventBus.js";
import { store } from "../../../app/store/index.js";
import { api } from "../../../shared/api/api.js";
import { getAvatar } from "../../../shared/helpers/getAvatar.js";

class Contacts {
    constructor(parentWidget) {
        this.parentWidget = parentWidget;
        this.container = null;
    }

    async getHTML() {
        const contacts = store.contacts;

        const template = Handlebars.templates["Contacts.hbs"];
        const html = template({ contacts });

        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");

        const domElement = doc.body.firstChild;

        this.container = domElement;

        this.addListeners();

        return domElement;
    }

    addListeners() {
        const finder=this.container.querySelector(".sidebar-header__search-input")
                finder.addEventListener('keypress', async function(event) {
                    if (event.key === 'Enter') {
                        //document.querySelector(".scrollable").innerHTML=""
                    // console.log(finder.value)
                    const responseBody1 = await api.get(`/search/contacts?query=${finder.value}`);
                    // console.log(responseBody1.data)
                    const contacts = [];
        if (responseBody1.data !== null) {
            for (const contact of responseBody1.data) {
                const username = contact["username"];

                const avatarPath = contact["avatar_path"];

                const avatarSrc = "icons/Profile.svg";
                if (avatarPath!==undefined){
                    avatarSrc = await getAvatar(avatarPath)
                }

                contacts.push({
                    username: username,
                    avatarSrc: avatarSrc,
                });
            }
        }
        // console.log(contacts)
        const templateSource = `
    <div class="sidebar-list scrollable">
            {{#each contacts}}
            <div class="sidebar-list__item sidebar-list-item">
                {{!-- Аватар --}}
                <img src="{{avatarSrc}}" alt="User avatar" class="avatar">

                {{!-- Информация о контакте --}}
                <div class="sidebar-list-item__info">
                    <div class="sidebar-list-item__full-name">{{username}}</div>
                    {{!-- <div class="sidebar-list-item__online-status">{{onlineStatus}}</div> --}}
                </div>

                {{!-- Удалить контакт --}}
                <button class="button">
                    <img src="icons/delete.svg" alt="Delete" class="icon">
                </button>
            </div>
            {{/each}}
        </div>
`;
const template1 = Handlebars.compile(templateSource);
// Создаем HTML из шаблона с данными
const html1 = template1({contacts:contacts});
// console.log(html1)
const container1 = document.querySelector('.contacts');
if (container1) {
    container1.innerHTML=""
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html1;
    container1.appendChild(tempDiv);
    // console.log(container1)
}

const contacts1 = document.querySelectorAll(".sidebar-list-item");
        for (let i = 0; i < contacts1.length; ++i) {
            const contactElement = contacts1[i];
            // console.log(contacts1[i])

            const deleteButton = contactElement.querySelector(".button");
            deleteButton.addEventListener("click", async (event) => {
                event.preventDefault();
                event.stopPropagation();

                const contactUser = contacts[i];

                const responseBody = {
                    username: contactUser.username,
                };

                await api.delete("/contacts", responseBody);

                contactElement.parentNode.removeChild(contactElement);
            });
        }

}
                })
                    
        const back = this.container.querySelector("#button-back");

        back.addEventListener("click", (event) => {
            event.preventDefault();
            eventBus.emit("contacts -> chats");
        });

        const contacts = this.container.querySelectorAll(".sidebar-list-item");
        for (let i = 0; i < contacts.length; ++i) {
            const contactElement = contacts[i];
            // console.log(contacts[i])

            const deleteButton = contactElement.querySelector(".button");
            deleteButton.addEventListener("click", async (event) => {
                event.preventDefault();
                event.stopPropagation();

                const contactUser = store.contacts[i];

                eventBus.emit("contacts: delete", contactUser.username);
            });
        }
    }
}

export const contacts = new Contacts();
