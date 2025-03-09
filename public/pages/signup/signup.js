import { root } from '../../app/main.js';
import { loadTemplate } from '../loadingTemplates.js';
export const renderSignup = (data) => {
    const signupTemplate = loadTemplate('signup');
    if (signupTemplate && typeof signupTemplate === 'function') {
        const html = signupTemplate(data);
        root.innerHTML = html;
    } else {
        console.error('signupTemplate is not a function:', signupTemplate);
    }
};