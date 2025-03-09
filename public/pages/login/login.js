import { root } from '../../app/main.js';
// import { authData } from "../../config/routes.js"
// import loginTemplate from './login.precompiled.js';


export const renderLogin = (data) => {
    console.log("render login");

    console.log(Handlebars);
    console.log("after check");

    // const html = loginTemplate(data);
    const template = Handlebars.templates["login.hbs"];
    return template({data});

    // root.innerHTML = html;
}
//todo подумать над правильными рендером прекомпилированных хбс