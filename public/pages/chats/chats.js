import { Chats } from "../../modules/chats.js";
import { Auth } from "../../modules/auth.js";

class ChatsPage {
    constructor() {
        this.popupState = false;
    }

    async render() {
        const chatsInstance = new Chats();
        const response = await chatsInstance.getChats();
        console.log("response", response);

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
        console.log("menu", menu);

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

                    const session = new Auth();
                    session.logout();

                    console.log("log out");

                    window.location.reload();
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
