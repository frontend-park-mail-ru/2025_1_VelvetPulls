import { root } from '../../app/main.js';
import signuoTemplate from './signup.precompiled.js';
export const renderSignup = (data) => {
    const html = signupTemplate(data);
    root.innerHTML = html;
}