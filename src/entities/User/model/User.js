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

    constructor() {
        // this.init(username);
    }

    async init(username) {
        console.log("init user:", username);
        const data = await getUserData(username);

        console.log("user data:", data);

        this.#username = data["username"];
        this.#firstName = data["first_name"];
        this.#lastName = data["last_name"];
        this.#phone = data["phone"];
        this.#avatarPath = data["avatar_path"];

        console.log("user with filled data:", this);

        if (this.#avatarPath !== null) {
            const path = this.#avatarPath.replace(".", "");
            this.avatarSrc = await getAvatar(path);
        }

        console.log("user after init", this);
    }

    async update(data) {
        const updatedData = await updateUser(data);
        console.log("update:", updatedData);

        // console.log(updatedData);

        this.#username = updatedData["username"];
        this.#firstName = updatedData["first_name"];
        this.#lastName = updatedData["last_name"];
        this.#avatarPath = updatedData["avatar_path"];
        this.#phone = updatedData["phone"];
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

    // addAvatar(avatarPath) {
    //     this.#avatarPaths.push(avatarPath);
    // }

    // getAvatarPath(i) {
    //     if (i >= this.#avatarPaths.length) {
    //         throw Error(
    //             `Выход за пределы массива: avatars.lenth=${this.#avatarPaths.length}, i=${i}`,
    //         );
    //     }

    //     return this.#avatarPaths[i];
    // }

    // getAvatarPathAll() {
    //     return this.#avatarPaths;
    // }
}

export const currentUser = new User();
currentUser.init(null);
