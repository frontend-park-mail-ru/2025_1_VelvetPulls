export const renderSignup = (data) => {
    console.log("render signup");

    const template = Handlebars.templates["signup.hbs"];
    return template({...data});
}
