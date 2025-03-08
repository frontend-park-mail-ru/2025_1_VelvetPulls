import Handlebars from 'handlebars';
import chatsTemplate from './chats.hbs';
import '../../static/css/mainPage.css';
export const renderChats = (data) => {
    const page = document.createElement('div');
    const template = Handlebars.templates['chats.hbs'];
    return page
}