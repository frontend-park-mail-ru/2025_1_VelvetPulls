export const renderLogin = (data) => {
    console.log("render login");

    const template = Handlebars.templates["login.hbs"];
    return template({...data});
}

//todo подумать над правильными рендером прекомпилированных хбс