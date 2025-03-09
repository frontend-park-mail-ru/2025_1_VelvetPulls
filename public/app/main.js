import { goToPage } from '../modules/router.js';

console.log("app/main.js");

export const root = document.getElementById("root");

export const appInit = () => {
    goToPage('chats');
};