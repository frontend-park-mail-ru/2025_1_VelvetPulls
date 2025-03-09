import { root } from '../../app/main.js';
import loginTemplate from './login.precompiled.js';
export const renderLogin = (data) => {
    const html = loginTemplate(data);
    root.innerHTML = html;
}
//todo подумать над правильными рендером прекомпилированных хбс