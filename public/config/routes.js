import { loginPage } from '../pages/login/login';
import { signupPage } from '../pages/signup/signup';

export const config = {
    'signup': {
        href: '/signup',
        title: 'Регистрация',
        render: loginPage
    },
    'login': {
        href: '/login',
        title: 'Авторизация',
        render: signupPage
    },
}