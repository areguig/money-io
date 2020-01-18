import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { MoneyIoTestModule } from '../../../test.module';
import { DebtDetailComponent } from 'app/entities/debt/debt-detail.component';
import { Debt } from 'app/shared/model/debt.model';

describe('Component Tests', () => {
  describe('Debt Management Detail Component', () => {
    let comp: DebtDetailComponent;
    let fixture: ComponentFixture<DebtDetailComponent>;
    const route = ({ data: of({ debt: new Debt(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [MoneyIoTestModule],
        declarations: [DebtDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }]
      })
        .overrideTemplate(DebtDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(DebtDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load debt on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.debt).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
