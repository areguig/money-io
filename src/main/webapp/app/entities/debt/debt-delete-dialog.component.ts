import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IDebt } from 'app/shared/model/debt.model';
import { DebtService } from './debt.service';

@Component({
  templateUrl: './debt-delete-dialog.component.html'
})
export class DebtDeleteDialogComponent {
  debt?: IDebt;

  constructor(protected debtService: DebtService, public activeModal: NgbActiveModal, protected eventManager: JhiEventManager) {}

  clear(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.debtService.delete(id).subscribe(() => {
      this.eventManager.broadcast('debtListModification');
      this.activeModal.close();
    });
  }
}
