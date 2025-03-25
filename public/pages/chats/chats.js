import { Chats } from "../../modules/chats.js";
import { auth } from "../../modules/auth.js";
import { goToPage } from "../../modules/router.js";

class ChatsPage {
    constructor() {
        this.popupState = false;
    }

    async render() {
        const chatsInstance = new Chats();
        const response = await chatsInstance.getChats();

        if (response.status === false) {
            return {
                ok: false,
                error: response.error,
            };
        }

        const chatsTemplate = Handlebars.templates["chats.hbs"];
        const html = chatsTemplate({ chats: response.data });

        const root = document.getElementById("root");
        root.innerHTML = html;

        this.addListeners();

        return {
            ok: true,
            error: "",
        };
    }

    addListeners() {
        const menu = document.getElementsByClassName("sidebar__menu")[0];

        menu.addEventListener("click", (event) => {
            event.preventDefault();

            if (this.popupState === false) {
                const menuList = document.createElement("div");
                menuList.classList.add("menu__list");
                menu.append(menuList);

                const menuItem = document.createElement("div");
                menuItem.setAttribute("name", "logout");
                menuItem.classList.add("menu__item");
                menuItem.innerHTML = "Выйти";
                menuList.append(menuItem);

                menuItem.addEventListener("click", (event) => {
                    event.preventDefault();

                    auth.logout();

                    goToPage("login");
                });

                this.popupState = true;
            } else {
                menu.removeChild(menu.lastChild);
                this.popupState = false;
            }
        });
    }
}

const chatsPage = new ChatsPage();
export default chatsPage;
