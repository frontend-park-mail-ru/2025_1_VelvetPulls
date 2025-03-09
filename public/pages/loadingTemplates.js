export const loadTemplate = (templateName) => {
    return Handlebars.templates[`${templateName}.hbs`];
};