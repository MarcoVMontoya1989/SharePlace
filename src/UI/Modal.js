//Rendering the modal from the locations
export class Modal {
    constructor(contentId, fallbackText) {
        this.fallbackText = fallbackText;
        this.contentTemplateEl = document.getElementById(contentId);
        this.modalTemplateEl = document.getElementById('modal-template');
    }

    show() {
        //trick to see if it's available to use the template in the browsers (except IE 6)
        if ('content' in document.createElement('template')) {
            //This will create a clone from the html modal element with the backdrop and modal style class.
            const modalElements = document.importNode(this.modalTemplateEl.content, true);

            this.modalElement = modalElements.querySelector('.modal');
            this.backdropElement = modalElements.querySelector('.backdrop');

            const contentElement = document.importNode(this.contentTemplateEl.content, true);

            //will append the content
            this.modalElement.appendChild(contentElement);

            document.body.insertAdjacentElement('afterbegin', this.modalElement);
            document.body.insertAdjacentElement('afterbegin', this.backdropElement);

        } else {
            alert(this.fallbackText);
        }
    }

    hide() {
        if (this.modalElement) {
            document.body.removeChild(this.modalElement);
            document.body.removeChild(this.backdropElement);
            this.modalElement = null;
            this.backdropElement = null;
        }

    }
}