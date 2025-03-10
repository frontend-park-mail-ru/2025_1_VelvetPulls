export const renderChats = (data) => {
    const chatsTemplate = Handlebars.templates["chats.hbs"];
    return chatsTemplate({ data });
};
//todo подумать над правильными рендером прекомпилированных хбс
