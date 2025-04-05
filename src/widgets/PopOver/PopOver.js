export class PopOver {
    constructor(items) {
        this.items = items;
        this.isOpen = false;
        this.element = null;
    }

    getHTML() {
        const template = Handlebars.templates["PopOver.hbs"];
        this.element = document.createElement("div");
        this.element.className = "popover-container";
        this.element.innerHTML = template({ items: this.items });
        return this.element;
    }

    close() {
        if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
        this.isOpen = false;
    }

    toggle() {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }

    open() {
        if (!this.isOpen) {
            this.isOpen = true;
            document.body.appendChild(this.element);
            this.positionPopover();
        }
    }

    positionPopover() {
        if (!this.element) return;
        
        const menuButton = document.querySelector('.sidebar__menu');
        if (!menuButton) return;
        
        const rect = menuButton.getBoundingClientRect();
        this.element.style.position = 'absolute';
        this.element.style.top = `${rect.bottom + window.scrollY}px`;
        this.element.style.left = `${rect.left + window.scrollX}px`;
        this.element.style.zIndex = '1000';
    }
}