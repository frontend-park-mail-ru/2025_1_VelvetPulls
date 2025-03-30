import { Chats } from "../../modules/chats.js";
import { PopOver } from "../PopOver/PopOver.js";
import { auth } from "../../modules/auth.js";
import { Profile } from "../Profile/Profile.js";
import { goToPage } from "../../modules/router.js";
import { Contacts } from "../Contacts/Contacts.js";

export class ListOfChats {
    constructor() {
        this.popupState = false;
    }

    async getData() {
        const chatsInstance = new Chats();
        const response = await chatsInstance.getChats();

        if (response.status === false) {
            return {
                ok: false,
                error: response.error,
            };
        }

        this.chats = response.data;

        return {
            ok: true,
            error: "",
        };
    }

    getHTML() {
        const template = Handlebars.templates["ListOfChats.hbs"];

        const chats = this.chats;

        return template({ chats });
    }

    addListeners(mainPage) {
        const menu = document.getElementsByClassName("sidebar__menu")[0];

        menu.addEventListener("click", (event) => {
            event.preventDefault();

            if (this.popupState === false) {
                const menuPopOver = new PopOver([
                    {
                        name: "profile",
                        svg: "../../static/img/profile_icon.svg",
                        content: "Профиль",
                    },
                    {
                        name: "contacts",
                        svg: "../../static/img/contacts_icon.svg",
                        content: "Контакты",
                    },
                    {
                        name: "logout",
                        svg: "../../static/img/logout_icon.svg",
                        content: "Выйти",
                    },
                ]);
                const menuListPopOver = menuPopOver.getHTML();
                menu.append(menuListPopOver);

                const logout = document.getElementsByName("logout")[0];
                logout.addEventListener("click", (event) => {
                    event.preventDefault();

                    auth.logout();

                    goToPage("login");
                });

                const profile = document.getElementsByName("profile")[0];
                profile.addEventListener("click", (event) => {
                    event.preventDefault();

                    mainPage.sidebar = new Profile();
                    mainPage.render();
                });

                const contacts = document.getElementsByName("contacts")[0];
                contacts.addEventListener("click", (event) => {
                    event.preventDefault();

                    mainPage.sidebar = new Contacts();
                    mainPage.render();
                });

                this.popupState = true;
            } else {
                menu.removeChild(menu.lastChild);
                this.popupState = false;
            }
        });
    }
}
