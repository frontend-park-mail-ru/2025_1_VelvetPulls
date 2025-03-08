import authTemplate from './auth.hbs';
export const renderLogin = (data) => {
    const compiledTemplate = authTemplate(data);

    container.innerHTML = compiledTemplate;
}