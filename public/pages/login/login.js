import { root } from '../../app/main.js';
import { loadTemplate } from '../loadingTemplates.js';
export const renderLogin = (data) => {
    const loginTemplate = loadTemplate('login');
    if (loginTemplate && typeof loginTemplate === 'function') {
        const html = loginTemplate(data);
        root.innerHTML = html;
    } else {
        console.error('loginTemplate is not a function:', loginTemplate);
    }
}
//todo подумать над правильными рендером прекомпилированных хбс