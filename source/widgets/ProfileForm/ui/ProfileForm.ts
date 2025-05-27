import ProfileFormTemplate from "./ProfileForm.handlebars";
import "./ProfileForm.scss";
import { API } from "@/shared/api/api";
import { validateNickname } from "@/shared/validation/nicknameValidation";
import { validateForm } from "@/shared/validation/formValidation";
import {
  EmptyRequest,
  EmptyResponse,
  ProfileRequest,
  ProfileResponse,
} from "@/shared/api/types";
import { UserStorage } from "@/entities/User";
import { validateYear } from "@/shared/validation/yearValidation";
import { serverHost, staticHost } from "@/app/config";
import { genProfileData } from "../api/updateProfile";
import { ChatList } from "@/widgets/ChatList";
import { Chat } from "@/widgets/Chat";
import { Router } from "@/shared/Router/Router";
import { wsConn } from "@/shared/api/ws";
import { validatePassword } from "@/shared/validation/passwordValidation";

export class ProfileForm {
  #parent;
  #chat;
  constructor(parent: HTMLElement, chat: Chat) {
    this.#parent = parent;
    this.#chat = chat;
  }

  async render() {
    const user = UserStorage.getUser();
    const response = await API.get<ProfileResponse>("/profile");

    if (response.data.avatar_path) {
      response.avatarURL = staticHost + response.avatarURL;
      response.ava = staticHost + response.data.avatar_path;
    } else {
      response.avatarURL = "/assets/image/default-avatar.svg";
      response.ava = "/assets/image/default-avatar.svg";
    }

    const currentDate = new Date();
    this.#parent.innerHTML = ProfileFormTemplate({
      user,
      response,
      currentDate,
    });

    if (response.data.birth_date) {
      response.birthdate = response.data.birth_date;
    }
    const bhd = new Date(response.birthdate);
    const birthday = `${bhd.getUTCFullYear()}-${(bhd.getUTCMonth() + 1)
      .toString()
      .padStart(2, "0")}-${bhd.getUTCDate().toString().padStart(2, "0")}`;
    const birthdayInput: HTMLInputElement =
      this.#parent.querySelector("#date")!;
    birthdayInput.value = birthday;

    const avatarUser: HTMLImageElement = this.#parent.querySelector("#avatar")!;
    const avatarInput: HTMLInputElement = this.#parent.querySelector("#ava")!;
    const pswdError: HTMLElement = this.#parent.querySelector("#pswd-err")!;
    let avatarFile: File;
    const handleAvatar = () => {
      if (avatarInput.files) {
        const file = avatarInput.files[0];
        const maxFileSize = 10 * 1024 * 1024;
        if (file) {
          const avatarSpanError: HTMLSpanElement =
            this.#parent.querySelector("#avatar-error")!;
          if (file.size > maxFileSize) {
            validateForm(
              avatarInput,
              "Размер файла не должен превышать 10МБ",
              avatarSpanError
            );
            return;
          } else {
            avatarSpanError.innerText = "";
          }
          avatarUser.src = URL.createObjectURL(file);
          avatarFile = file;
        }
      }
    };
    avatarInput.addEventListener("change", handleAvatar);

    const passwordInput: HTMLInputElement =
      this.#parent.querySelector("#password")!;
    const passwordRepeatInput: HTMLInputElement =
      this.#parent.querySelector("#password-repeat")!;

    const handleTogglePasswordVisibility = () => {
      passwordInput.type =
        passwordInput.type === "password" ? "text" : "password";
    };
    this.#parent
      .querySelector("#password-visibility-toggle")!
      .addEventListener("click", handleTogglePasswordVisibility);

    const handleTogglePasswordVisibility1 = () => {
      passwordRepeatInput.type =
        passwordRepeatInput.type === "password" ? "text" : "password";
    };
    this.#parent
      .querySelector("#password-repeat-visibility-toggle")!
      .addEventListener("click", handleTogglePasswordVisibility1);

    const backButton = this.#parent.querySelector("#back-button");
    const handleBack = () => {
      const chatList = new ChatList(this.#parent, this.#chat);
      chatList.render();
    };
    backButton?.addEventListener("click", handleBack);

    const confirmButton = this.#parent.querySelector("#confirm-button");
    const updateProfileInfo = async () => {
      const nameInput: HTMLInputElement =
        this.#parent.querySelector("#nickname")!;
      const dateInput: HTMLInputElement = this.#parent.querySelector("#date")!;

      const nickname = nameInput.value.trim();
      const birthdayValue = dateInput.value;
      const password = passwordInput.value;
      const passwordRepeat = passwordRepeatInput.value;

      const profileData: ProfileRequest = {
        bio: password,
        birthdate: new Date(birthdayValue),
        name: nickname,
        bio1: passwordRepeat,
      };

      let flag = true;
      const nicknameError = this.#parent.querySelector("#nickname-error")!;
      const passwordError = this.#parent.querySelector("#pswd-err")!;
      const dateError = this.#parent.querySelector("#date-error")!;

      // Валидация имени (только если не пустое)
      if (nickname) {
        if (!validateNickname(nickname)) {
          validateForm(
            nameInput,
            "Допустимы только латинские и русские буквы, пробелы, цифры и нижние подчеркивания.",
            nicknameError
          );
          flag = false;
        } else if (nickname.length > 20) {
          validateForm(
            nameInput,
            "Имя не может быть длиннее 20 символов",
            nicknameError
          );
          flag = false;
        } else {
          nicknameError.textContent = "";
        }
      } else {
        nicknameError.textContent = "";
      }

      // Валидация паролей (только если хотя бы одно поле заполнено)
      if (password || passwordRepeat) {
        if (password !== passwordRepeat) {
          validateForm(passwordInput, "Пароли не совпали", passwordError);
          flag = false;
        } else if (!validatePassword(password)) {
          validateForm(
            passwordInput,
            "Пароль должен состоять минимум из 8 латинских букв, цифр или нижних подчеркиваний.",
            passwordError
          );
          flag = false;
        } else {
          passwordError.textContent = "";
        }
      } else {
        passwordError.textContent = "";
      }

      // Валидация даты (обязательное поле)
      if (!birthdayValue) {
        validateForm(dateInput, "Дата рождения обязательна", dateError);
        flag = false;
      } else {
        const birthDate = new Date(birthdayValue);
        if (isNaN(birthDate.getTime())) {
          validateForm(dateInput, "Некорректная дата", dateError);
          flag = false;
        } else if (!validateYear(birthDate)) {
          validateForm(
            dateInput,
            `Год рождения должен быть от 1920 до ${new Date().getFullYear()}`,
            dateError
          );
          flag = false;
        } else {
          dateError.textContent = "";
        }
      }

      if (!flag) {
        return;
      }

      const errorMessage = await genProfileData(profileData, avatarFile);
      if (errorMessage) {
        validateForm(
          nameInput,
          errorMessage === "error message"
            ? "Вы не авторизованы"
            : "Произошла ошибка, попробуйте еще раз",
          nicknameError
        );
        return;
      }

      if (avatarFile) {
        const userAvatar: HTMLImageElement =
          document.querySelector("#avatar")!;
        userAvatar.src = URL.createObjectURL(avatarFile);
        UserStorage.setAvatar(userAvatar.src);
      }
      UserStorage.setUserName(nickname);

      handleBack();
    };
    confirmButton?.addEventListener("click", updateProfileInfo);

    const exitButton = this.#parent.querySelector("#logout")!;

    const handleExitClick = async () => {
      const response = await API.delete<EmptyResponse, EmptyRequest>(
        "/logout",
        {}
      );

      if (!response.error) {
        UserStorage.setUser({ id: "", name: "", username: "", avatarURL: "" });
        wsConn.close();
        Router.go("/login");
      }
    };

    exitButton.addEventListener("click", handleExitClick);

    document.querySelector<HTMLElement>("#chat-info-container")!.style.right =
      "-100vw";
    this.#parent.style.left = "0";
  }
}