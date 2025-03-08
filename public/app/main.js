import { goToPage } from '../modules/router.js';
import './common.css';
import './fonts.css';

export const root = document.getElementById("root");

export const appInit = () => {
    goToPage('login');
};