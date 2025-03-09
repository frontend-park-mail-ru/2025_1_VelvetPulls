import { root } from "../../app/main";
// import chatsTemplate from "./chats.precompiled";

export const renderChats = (data) => {
    const html = chatsTemplate(data);
    root.innerHTML = html;
}
//todo подумать над правильными рендером прекомпилированных хбс