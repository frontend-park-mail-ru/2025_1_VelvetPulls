export class RenderResult {
    constructor({ error = null, redirect = null }) {
        this.error = error;
        this.redirect = redirect;
    }
}
