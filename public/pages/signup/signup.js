import signupTemplate from './signup.hbs';
import { root } from '../../app/main.js';
export const renderSignup = (data) => {
    const compiledTemplate = signupTemplate(data);
    root.innerHTML = compiledTemplate;
}