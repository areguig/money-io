import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MoneyIoSharedModule } from 'app/shared/shared.module';
import { DebtComponent } from './debt.component';
import { DebtDetailComponent } from './debt-detail.component';
import { DebtUpdateComponent } from './debt-update.component';
import { DebtDeleteDialogComponent } from './debt-delete-dialog.component';
import { debtRoute } from './debt.route';

@NgModule({
  imports: [MoneyIoSharedModule, RouterModule.forChild(debtRoute)],
  declarations: [DebtComponent, DebtDetailComponent, DebtUpdateComponent, DebtDeleteDialogComponent],
  entryComponents: [DebtDeleteDialogComponent]
})
export class MoneyIoDebtModule {}
