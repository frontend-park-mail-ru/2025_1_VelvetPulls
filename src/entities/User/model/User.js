// import { eventBus } from "../../../shared/modules/EventBus/EventBus.js";
import { getUserData, updateUser } from "../api/api.js";
import { getAvatar } from "../../../shared/helpers/getAvatar.js";

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

    async init(username) {
        const data = await getUserData(username);

        this.#username = data["username"];
        this.#phone = data["phone"];
        this.#avatarPath = data["avatar_path"];
        this.#email = data["email"];

        if (data["first_name"] === null || data["first_name"] === undefined) {
            this.#firstName = "";
        } else {
            this.#firstName = data["first_name"];
        }

        if (data["last_name"] === null || data["last_name"] === undefined) {
            this.#lastName = "";
        } else {
            this.#lastName = data["last_name"];
        }

        if (this.#avatarPath !== null) {
            const path = this.#avatarPath.replace(".", "");
            this.avatarSrc = await getAvatar(path);
        } else {
            this.avatarSrc = undefined;
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

    getEmail(){
        return this.#email;
    }
}

export let currentUser = new User();
currentUser.init(null);
