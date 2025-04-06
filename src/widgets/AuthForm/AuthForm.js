export class AuthForm {
    constructor(fields, submitButtonText) {
        this.fields = fields;
        this.submitButtonText = submitButtonText;
    }

    render() {
        Handlebars.registerHelper("eq", function (a, b) {
            return a === b;
        });

        const template = Handlebars.templates["AuthForm.hbs"];

        const fields = this.fields;
        const submitButtonText = this.submitButtonText;

        const html = template({ fields, submitButtonText });

        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");

        const domElement = doc.body.firstChild;
        console.log("form", domElement);

        return domElement;
    }
}
