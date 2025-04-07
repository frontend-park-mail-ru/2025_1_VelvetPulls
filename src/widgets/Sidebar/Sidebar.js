import { Chats } from "../../features/Chats/Chats.js";
import { Contacts } from "../../features/Contacts/Contacts.js";
import { EditProfile } from "../../features/EditProfile/EditProfile.js";
import { Profile } from "../../features/Profile/Profile.js";
import { goToPage } from "../../shared/helpers/goToPage.js";

export class Sidebar {
    constructor() {
        this.content = new Chats(this);
    }

    goTo(target) {
        switch (target) {
            case "chats":
                this.content = new Chats(this);
                break;

            case "contacts":
                this.content = new Contacts(this);
                break;

            case "profile":
                this.content = new Profile(this);
                break;

            case "edit-profile":
                this.content = new EditProfile(this);
                break;

            default:
                console.error(
                    `Sidebar.changeTo: target ${target} is not found`,
                );
        }

        goToPage("main");
    }

    getHTML() {
        return this.content.getHTML();
    }
}
