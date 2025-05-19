export class SelectedContacts {
  #selectedContacts: string[];

  constructor() {
    this.#selectedContacts = [];
  }

  getSelectedContacts() {
    return this.#selectedContacts;
  }

  toggleCheckbox(contactId: string) {
    if (this.#selectedContacts.includes(contactId)) {
      this.#selectedContacts = this.#selectedContacts.filter(
        (username) => username !== contactId,
      );
    } else {
      this.#selectedContacts = [...this.#selectedContacts, contactId];
    }
  }
}
