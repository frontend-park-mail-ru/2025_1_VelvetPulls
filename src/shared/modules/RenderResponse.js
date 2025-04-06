export class RenderResult {
    constructor({ domElement = null, error = null, redirect = null }) {
        this.domElement = domElement;
        this.error = error;
        this.redirect = redirect;
    }
}
