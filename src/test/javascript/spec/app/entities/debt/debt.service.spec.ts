import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { take, map } from 'rxjs/operators';
import * as moment from 'moment';
import { DATE_FORMAT } from 'app/shared/constants/input.constants';
import { DebtService } from 'app/entities/debt/debt.service';
import { IDebt, Debt } from 'app/shared/model/debt.model';
import { Currency } from 'app/shared/model/enumerations/currency.model';
import { Owner } from 'app/shared/model/enumerations/owner.model';

describe('Service Tests', () => {
  describe('Debt Service', () => {
    let injector: TestBed;
    let service: DebtService;
    let httpMock: HttpTestingController;
    let elemDefault: IDebt;
    let expectedResult: IDebt | IDebt[] | boolean | null;
    let currentDate: moment.Moment;
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule]
      });
      expectedResult = null;
      injector = getTestBed();
      service = injector.get(DebtService);
      httpMock = injector.get(HttpTestingController);
      currentDate = moment();

      elemDefault = new Debt(0, 0, Currency.AED, 'AAAAAAA', Owner.MINE, false, currentDate, currentDate);
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign(
          {
            created: currentDate.format(DATE_FORMAT),
            dueDate: currentDate.format(DATE_FORMAT)
          },
          elemDefault
        );
        service
          .find(123)
          .pipe(take(1))
          .subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a Debt', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
            created: currentDate.format(DATE_FORMAT),
            dueDate: currentDate.format(DATE_FORMAT)
          },
          elemDefault
        );
        const expected = Object.assign(
          {
            created: currentDate,
            dueDate: currentDate
          },
          returnedFromService
        );
        service
          .create(new Debt())
          .pipe(take(1))
          .subscribe(resp => (expectedResult = resp.body));
        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Debt', () => {
        const returnedFromService = Object.assign(
          {
            amount: 1,
            currency: 'BBBBBB',
            comment: 'BBBBBB',
            owner: 'BBBBBB',
            closed: true,
            created: currentDate.format(DATE_FORMAT),
            dueDate: currentDate.format(DATE_FORMAT)
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            created: currentDate,
            dueDate: currentDate
          },
          returnedFromService
        );
        service
          .update(expected)
          .pipe(take(1))
          .subscribe(resp => (expectedResult = resp.body));
        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Debt', () => {
        const returnedFromService = Object.assign(
          {
            amount: 1,
            currency: 'BBBBBB',
            comment: 'BBBBBB',
            owner: 'BBBBBB',
            closed: true,
            created: currentDate.format(DATE_FORMAT),
            dueDate: currentDate.format(DATE_FORMAT)
          },
          elemDefault
        );
        const expected = Object.assign(
          {
            created: currentDate,
            dueDate: currentDate
          },
          returnedFromService
        );
        service
          .query()
          .pipe(
            take(1),
            map(resp => resp.body)
          )
          .subscribe(body => (expectedResult = body));
        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a Debt', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
