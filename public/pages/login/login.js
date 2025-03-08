import authTemplate from './auth.hbs';
export const renderLogin = (data) => {
    const container = document.getElementById('main-auth');

    if (container) {

        const compiledTemplate = authTemplate(data);

        container.innerHTML = compiledTemplate;
    } else {
        console.error('Container with id "main-auth" not found');
    }
}