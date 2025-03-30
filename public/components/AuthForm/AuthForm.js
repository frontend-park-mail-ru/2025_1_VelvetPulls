export class AuthForm {
    constructor(fields, submitButtonText) {
        this.fields = fields;
        this.submitButtonText = submitButtonText;
    }

    getHTML() {
        Handlebars.registerHelper("eq", function (a, b) {
            return a === b;
        });

        const template = Handlebars.templates["AuthForm.hbs"];

        const fields = this.fields;
        const submitButtonText = this.submitButtonText;

        return template({
            fields,
            submitButtonText,
        });
    }
}
