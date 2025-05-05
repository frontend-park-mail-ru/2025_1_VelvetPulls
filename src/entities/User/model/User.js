// import { eventBus } from "../../../shared/modules/EventBus/EventBus.js";
import { getUserData, updateUser } from "../api/api.js";
import { getAvatar } from "../../../shared/helpers/getAvatar.js";
import { store } from "../../../app/store/index.js";

// function checkUsernameIsValid(input) {
//     const patt = /^[a-zA-Z0-9_]{3,20}$/;
//     return patt.test(input.value);
// }

export class User {
    #username;
    #firstName;
    #lastName;
    #phone;
    #avatarPath;
    #email;
    #password;

    async init(username) {
        const data = await getUserData(username);
        if (data!==undefined){
            this.#username = data["username"];
        this.#phone = data["phone"];
        this.#avatarPath = data["avatar_path"];
        this.#email = data["email"];
        this.#password = data["password"];
        } else {
            this.#username = undefined;
        this.#phone = undefined;
        this.#avatarPath = "";
        this.#email = undefined;
        this.#password = undefined;
        }

        // this.#username = data["username"];
        // this.#phone = data["phone"];
        // this.#avatarPath = data["avatar_path"];
        // this.#email = data["email"];
        // this.#password = data["password"];

        if (data === undefined || data["first_name"] === null || data["first_name"] === undefined) {
            this.#firstName = "";
        } else {
            this.#firstName = data["first_name"];
        }

        if (data === undefined || data["last_name"] === null || data["last_name"] === undefined) {
            this.#lastName = "";
        } else {
            this.#lastName = data["last_name"];
        }

        if (data !== undefined && ((this.#avatarPath !== null)&&(this.#avatarPath !== undefined))) {
            const path = this.#avatarPath.replace(".", "");
            this.avatarSrc = await getAvatar(path);
        } else {
            this.avatarSrc = "icons/Profile.svg";
        }
    }

    async update(data) {
        const updatedData = await updateUser(data);

        this.#username = updatedData["username"];
        this.#firstName = updatedData["first_name"];
        this.#lastName = updatedData["last_name"];
        this.#avatarPath = updatedData["avatar_path"];
        this.#phone = updatedData["phone"];
        this.#email = updatedData["email"];
    }

    getUsername() {
        if (this.#username===undefined){
            return store.profile.username
        }
        return this.#username;
    }

    getFirstName() {
        return this.#firstName;
    }

    getLastName() {
        return this.#lastName;
    }

    getFullName() {
        if (this.#lastName === "") {
            return this.#firstName;
        }

        return `${this.#firstName} ${this.#lastName}`;
    }

    getPhone() {
        return this.#phone;
    }

    getAvatarPath() {
        return this.#avatarPath;
    }

    getEmail() {
        return this.#email;
    }
}

export let currentUser = new User();
currentUser.init(null);
