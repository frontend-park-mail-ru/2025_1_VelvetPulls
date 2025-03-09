import { loadTemplate } from '../loadingTemplates.js';
import { authHandler } from '../../handlers/authHandler.js';
export const renderSignup = (data) => {
    const signupTemplate = Handlebars.templates['signup.hbs'];
    const {fields, buttonText, redirectText} = data;
    const html = signupTemplate({fields, buttonText, redirectText})

    return {
        html,
        addListeners: () => {
            const signupForm = document.querySelector('.signupForm');
            if (signupForm && typeof signupForm.addEventListener === 'function') {
                signupForm.addEventListener('submit', async (e) => {
                    e.preventDefault();
                    const username = document.getElementById('username').value;
                    const phone = document.getElementById('phone').value;
                    const password = document.getElementById('password').value;
                    const repeatPassword = document.getElementById('confirm-password').value;
                    await authHandler.handleRegister(username, phone, password, repeatPassword);
                });
            }

            const loginLink = document.getElementById('loginLink');
            if (loginLink && typeof loginLink.addEventListener === 'function') {
                loginLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    authHandler.redirectToLogin();
                });
            }
        }
    };
};