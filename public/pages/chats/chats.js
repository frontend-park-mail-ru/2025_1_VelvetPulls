import { root } from "../../app/main.js";
import { loadTemplate } from "../loadingTemplates.js";
export const renderChats = (data) => {
    const chatsTemplate = loadTemplate('chats');
    if (chatsTemplate && typeof chatsTemplate === 'function') {
        const html = chatsTemplate(data);
        root.innerHTML = html;
    } else {
        console.error('chatsTemplate is not a function:', chatsTemplate);
    }
};
//todo подумать над правильными рендером прекомпилированных хбс