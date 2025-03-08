import authTemplate from './login.hbs';
import { root } from '../../app/main.js';
export const renderLogin = (data) => {
    const compiledTemplate = authTemplate(data);
    root.innerHTML = compiledTemplate;
}