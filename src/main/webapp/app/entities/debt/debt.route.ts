import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { IDebt, Debt } from 'app/shared/model/debt.model';
import { DebtService } from './debt.service';
import { DebtComponent } from './debt.component';
import { DebtDetailComponent } from './debt-detail.component';
import { DebtUpdateComponent } from './debt-update.component';

@Injectable({ providedIn: 'root' })
export class DebtResolve implements Resolve<IDebt> {
  constructor(private service: DebtService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IDebt> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((debt: HttpResponse<Debt>) => {
          if (debt.body) {
            return of(debt.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Debt());
  }
}

export const debtRoute: Routes = [
  {
    path: '',
    component: DebtComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'moneyIoApp.debt.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: DebtDetailComponent,
    resolve: {
      debt: DebtResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'moneyIoApp.debt.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: DebtUpdateComponent,
    resolve: {
      debt: DebtResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'moneyIoApp.debt.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: DebtUpdateComponent,
    resolve: {
      debt: DebtResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'moneyIoApp.debt.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];
