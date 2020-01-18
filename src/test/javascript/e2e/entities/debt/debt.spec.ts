import { browser, ExpectedConditions as ec /* , promise */ } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import {
  DebtComponentsPage,
  /* DebtDeleteDialog,
   */ DebtUpdatePage
} from './debt.page-object';

const expect = chai.expect;

describe('Debt e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let debtComponentsPage: DebtComponentsPage;
  let debtUpdatePage: DebtUpdatePage;
  /* let debtDeleteDialog: DebtDeleteDialog; */

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing('admin', 'admin');
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load Debts', async () => {
    await navBarPage.goToEntity('debt');
    debtComponentsPage = new DebtComponentsPage();
    await browser.wait(ec.visibilityOf(debtComponentsPage.title), 5000);
    expect(await debtComponentsPage.getTitle()).to.eq('moneyIoApp.debt.home.title');
  });

  it('should load create Debt page', async () => {
    await debtComponentsPage.clickOnCreateButton();
    debtUpdatePage = new DebtUpdatePage();
    expect(await debtUpdatePage.getPageTitle()).to.eq('moneyIoApp.debt.home.createOrEditLabel');
    await debtUpdatePage.cancel();
  });

  /*  it('should create and save Debts', async () => {
        const nbButtonsBeforeCreate = await debtComponentsPage.countDeleteButtons();

        await debtComponentsPage.clickOnCreateButton();
        await promise.all([
            debtUpdatePage.setAmountInput('5'),
            debtUpdatePage.currencySelectLastOption(),
            debtUpdatePage.setCommentInput('comment'),
            debtUpdatePage.ownerSelectLastOption(),
            debtUpdatePage.setCreatedInput('2000-12-31'),
            debtUpdatePage.setDueDateInput('2000-12-31'),
            debtUpdatePage.userSelectLastOption(),
            debtUpdatePage.contactSelectLastOption(),
        ]);
        expect(await debtUpdatePage.getAmountInput()).to.eq('5', 'Expected amount value to be equals to 5');
        expect(await debtUpdatePage.getCommentInput()).to.eq('comment', 'Expected Comment value to be equals to comment');
        const selectedClosed = debtUpdatePage.getClosedInput();
        if (await selectedClosed.isSelected()) {
            await debtUpdatePage.getClosedInput().click();
            expect(await debtUpdatePage.getClosedInput().isSelected(), 'Expected closed not to be selected').to.be.false;
        } else {
            await debtUpdatePage.getClosedInput().click();
            expect(await debtUpdatePage.getClosedInput().isSelected(), 'Expected closed to be selected').to.be.true;
        }
        expect(await debtUpdatePage.getCreatedInput()).to.eq('2000-12-31', 'Expected created value to be equals to 2000-12-31');
        expect(await debtUpdatePage.getDueDateInput()).to.eq('2000-12-31', 'Expected dueDate value to be equals to 2000-12-31');
        await debtUpdatePage.save();
        expect(await debtUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

        expect(await debtComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
    }); */

  /*  it('should delete last Debt', async () => {
        const nbButtonsBeforeDelete = await debtComponentsPage.countDeleteButtons();
        await debtComponentsPage.clickOnLastDeleteButton();

        debtDeleteDialog = new DebtDeleteDialog();
        expect(await debtDeleteDialog.getDialogTitle())
            .to.eq('moneyIoApp.debt.delete.question');
        await debtDeleteDialog.clickOnConfirmButton();

        expect(await debtComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
    }); */

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
