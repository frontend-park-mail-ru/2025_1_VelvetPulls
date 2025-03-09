export const loadTemplate = async (templateName) => {
    if (!Handlebars) {
        Handlebars = await import('https://cdn.jsdelivr.net/npm/handlebars@4.7.7/dist/handlebars.min.js');
        console.log('here1');
    }
    console.log('here2');
    console.log(Handlebars.templates)
    return Handlebars.templates[`${templateName}.hbs`];
};