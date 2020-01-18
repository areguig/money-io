import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as moment from 'moment';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { DATE_FORMAT } from 'app/shared/constants/input.constants';
import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { IDebt } from 'app/shared/model/debt.model';

type EntityResponseType = HttpResponse<IDebt>;
type EntityArrayResponseType = HttpResponse<IDebt[]>;

@Injectable({ providedIn: 'root' })
export class DebtService {
  public resourceUrl = SERVER_API_URL + 'api/debts';

  constructor(protected http: HttpClient) {}

  create(debt: IDebt): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(debt);
    return this.http
      .post<IDebt>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(debt: IDebt): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(debt);
    return this.http
      .put<IDebt>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IDebt>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IDebt[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  protected convertDateFromClient(debt: IDebt): IDebt {
    const copy: IDebt = Object.assign({}, debt, {
      created: debt.created && debt.created.isValid() ? debt.created.format(DATE_FORMAT) : undefined,
      dueDate: debt.dueDate && debt.dueDate.isValid() ? debt.dueDate.format(DATE_FORMAT) : undefined
    });
    return copy;
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.created = res.body.created ? moment(res.body.created) : undefined;
      res.body.dueDate = res.body.dueDate ? moment(res.body.dueDate) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((debt: IDebt) => {
        debt.created = debt.created ? moment(debt.created) : undefined;
        debt.dueDate = debt.dueDate ? moment(debt.dueDate) : undefined;
      });
    }
    return res;
  }
}
