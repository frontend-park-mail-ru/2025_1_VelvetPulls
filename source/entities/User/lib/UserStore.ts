import { API } from "@/shared/api/api";
import { TUser } from "../index";
import { AuthResponse } from "@/shared/api/types";
import { wsConn } from "@/shared/api/ws";

class UserStore {
  #user: TUser;

  constructor() {
    this.#user = { id: "", name: "", username: "", avatarURL: "" };
  }

  async init() {
    const response = await API.get<AuthResponse>("/profile");
    console.log(response)
    if (!response.error) {
      this.#user = response.data;
      console.log(this.#user,response.data)
      wsConn.start();
    }
  }

  setUser(user: TUser) {
    this.#user = user;
  }

  setAvatar(avatar: string) {
    this.#user.avatarURL = avatar;
  }

  getUser() {
    return this.#user;
  }

  setUserName(name: string) {
    this.#user.name = name;
  }
}

export const UserStorage = new UserStore();
