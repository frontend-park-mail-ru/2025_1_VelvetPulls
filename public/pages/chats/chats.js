export const renderChats = (data) => {
    console.log("render chats");

    const template = Handlebars.templates["chats.hbs"];
    return template({...data});
}

//todo подумать над правильными рендером прекомпилированных хбс