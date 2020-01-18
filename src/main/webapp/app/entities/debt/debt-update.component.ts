import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as moment from 'moment';

import { IDebt, Debt } from 'app/shared/model/debt.model';
import { DebtService } from './debt.service';
import { IUser } from 'app/core/user/user.model';
import { UserService } from 'app/core/user/user.service';
import { IContact } from 'app/shared/model/contact.model';
import { ContactService } from 'app/entities/contact/contact.service';

type SelectableEntity = IUser | IContact;

@Component({
  selector: 'jhi-debt-update',
  templateUrl: './debt-update.component.html'
})
export class DebtUpdateComponent implements OnInit {
  isSaving = false;

  users: IUser[] = [];

  contacts: IContact[] = [];
  createdDp: any;
  dueDateDp: any;

  editForm = this.fb.group({
    id: [],
    amount: [null, [Validators.required]],
    currency: [null, [Validators.required]],
    comment: [],
    owner: [null, [Validators.required]],
    closed: [null, [Validators.required]],
    created: [null, [Validators.required]],
    dueDate: [],
    user: [null, Validators.required],
    contact: [null, Validators.required]
  });

  constructor(
    protected debtService: DebtService,
    protected userService: UserService,
    protected contactService: ContactService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ debt }) => {
      this.updateForm(debt);

      this.userService
        .query()
        .pipe(
          map((res: HttpResponse<IUser[]>) => {
            return res.body ? res.body : [];
          })
        )
        .subscribe((resBody: IUser[]) => (this.users = resBody));

      this.contactService
        .query()
        .pipe(
          map((res: HttpResponse<IContact[]>) => {
            return res.body ? res.body : [];
          })
        )
        .subscribe((resBody: IContact[]) => (this.contacts = resBody));
    });
  }

  updateForm(debt: IDebt): void {
    this.editForm.patchValue({
      id: debt.id,
      amount: debt.amount,
      currency: debt.currency,
      comment: debt.comment,
      owner: debt.owner,
      closed: debt.closed,
      created: debt.created,
      dueDate: debt.dueDate,
      user: debt.user,
      contact: debt.contact
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const debt = this.createFromForm();
    if (debt.id !== undefined) {
      this.subscribeToSaveResponse(this.debtService.update(debt));
    } else {
      this.subscribeToSaveResponse(this.debtService.create(debt));
    }
  }

  private createFromForm(): IDebt {
    return {
      ...new Debt(),
      id: this.editForm.get(['id'])!.value,
      amount: this.editForm.get(['amount'])!.value,
      currency: this.editForm.get(['currency'])!.value,
      comment: this.editForm.get(['comment'])!.value,
      owner: this.editForm.get(['owner'])!.value,
      closed: this.editForm.get(['closed'])!.value,
      created: this.editForm.get(['created'])!.value,
      dueDate: this.editForm.get(['dueDate'])!.value,
      user: this.editForm.get(['user'])!.value,
      contact: this.editForm.get(['contact'])!.value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IDebt>>): void {
    result.subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.isSaving = false;
    this.previousState();
  }

  protected onSaveError(): void {
    this.isSaving = false;
  }

  trackById(index: number, item: SelectableEntity): any {
    return item.id;
  }
}
