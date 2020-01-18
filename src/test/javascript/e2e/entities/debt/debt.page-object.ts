import { element, by, ElementFinder } from 'protractor';

export class DebtComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-debt div table .btn-danger'));
  title = element.all(by.css('jhi-debt div h2#page-heading span')).first();

  async clickOnCreateButton(): Promise<void> {
    await this.createButton.click();
  }

  async clickOnLastDeleteButton(): Promise<void> {
    await this.deleteButtons.last().click();
  }

  async countDeleteButtons(): Promise<number> {
    return this.deleteButtons.count();
  }

  async getTitle(): Promise<string> {
    return this.title.getAttribute('jhiTranslate');
  }
}

export class DebtUpdatePage {
  pageTitle = element(by.id('jhi-debt-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));
  amountInput = element(by.id('field_amount'));
  currencySelect = element(by.id('field_currency'));
  commentInput = element(by.id('field_comment'));
  ownerSelect = element(by.id('field_owner'));
  closedInput = element(by.id('field_closed'));
  createdInput = element(by.id('field_created'));
  dueDateInput = element(by.id('field_dueDate'));
  userSelect = element(by.id('field_user'));
  contactSelect = element(by.id('field_contact'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getAttribute('jhiTranslate');
  }

  async setAmountInput(amount: string): Promise<void> {
    await this.amountInput.sendKeys(amount);
  }

  async getAmountInput(): Promise<string> {
    return await this.amountInput.getAttribute('value');
  }

  async setCurrencySelect(currency: string): Promise<void> {
    await this.currencySelect.sendKeys(currency);
  }

  async getCurrencySelect(): Promise<string> {
    return await this.currencySelect.element(by.css('option:checked')).getText();
  }

  async currencySelectLastOption(): Promise<void> {
    await this.currencySelect
      .all(by.tagName('option'))
      .last()
      .click();
  }

  async setCommentInput(comment: string): Promise<void> {
    await this.commentInput.sendKeys(comment);
  }

  async getCommentInput(): Promise<string> {
    return await this.commentInput.getAttribute('value');
  }

  async setOwnerSelect(owner: string): Promise<void> {
    await this.ownerSelect.sendKeys(owner);
  }

  async getOwnerSelect(): Promise<string> {
    return await this.ownerSelect.element(by.css('option:checked')).getText();
  }

  async ownerSelectLastOption(): Promise<void> {
    await this.ownerSelect
      .all(by.tagName('option'))
      .last()
      .click();
  }

  getClosedInput(): ElementFinder {
    return this.closedInput;
  }
  async setCreatedInput(created: string): Promise<void> {
    await this.createdInput.sendKeys(created);
  }

  async getCreatedInput(): Promise<string> {
    return await this.createdInput.getAttribute('value');
  }

  async setDueDateInput(dueDate: string): Promise<void> {
    await this.dueDateInput.sendKeys(dueDate);
  }

  async getDueDateInput(): Promise<string> {
    return await this.dueDateInput.getAttribute('value');
  }

  async userSelectLastOption(): Promise<void> {
    await this.userSelect
      .all(by.tagName('option'))
      .last()
      .click();
  }

  async userSelectOption(option: string): Promise<void> {
    await this.userSelect.sendKeys(option);
  }

  getUserSelect(): ElementFinder {
    return this.userSelect;
  }

  async getUserSelectedOption(): Promise<string> {
    return await this.userSelect.element(by.css('option:checked')).getText();
  }

  async contactSelectLastOption(): Promise<void> {
    await this.contactSelect
      .all(by.tagName('option'))
      .last()
      .click();
  }

  async contactSelectOption(option: string): Promise<void> {
    await this.contactSelect.sendKeys(option);
  }

  getContactSelect(): ElementFinder {
    return this.contactSelect;
  }

  async getContactSelectedOption(): Promise<string> {
    return await this.contactSelect.element(by.css('option:checked')).getText();
  }

  async save(): Promise<void> {
    await this.saveButton.click();
  }

  async cancel(): Promise<void> {
    await this.cancelButton.click();
  }

  getSaveButton(): ElementFinder {
    return this.saveButton;
  }
}

export class DebtDeleteDialog {
  private dialogTitle = element(by.id('jhi-delete-debt-heading'));
  private confirmButton = element(by.id('jhi-confirm-delete-debt'));

  async getDialogTitle(): Promise<string> {
    return this.dialogTitle.getAttribute('jhiTranslate');
  }

  async clickOnConfirmButton(): Promise<void> {
    await this.confirmButton.click();
  }
}
