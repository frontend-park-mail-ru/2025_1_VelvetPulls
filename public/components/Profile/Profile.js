import { ListOfChats } from "../ListOfChats/ListOfChats.js";
import { ProfileApi } from "../../modules/profile.js";

export class Profile {
    constructor() {
        this.popupState = false;
    }
    async getData() {
        const profileInstance = new ProfileApi();
        const response = await profileInstance.getProfile();
    
        if (response.status === false) {
            return {
                ok: false,
                error: response.error,
            };
        }
    
        this.data = response.data;
    
        return {
            ok: true,
            error: "",
        };
    }

    getHTML() {
        const template = Handlebars.templates["Profile.hbs"];
        const profile = this.data;
        return template({ profile });
    }

    addListeners(mainPage) {
        const back = document.getElementsByName("back")[0];

        back.addEventListener("click", (event) => {
            event.preventDefault();

            mainPage.sidebar = new ListOfChats();
            mainPage.render();
        });
    }
}
