import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

import { MoneyIoTestModule } from '../../../test.module';
import { DebtUpdateComponent } from 'app/entities/debt/debt-update.component';
import { DebtService } from 'app/entities/debt/debt.service';
import { Debt } from 'app/shared/model/debt.model';

describe('Component Tests', () => {
  describe('Debt Management Update Component', () => {
    let comp: DebtUpdateComponent;
    let fixture: ComponentFixture<DebtUpdateComponent>;
    let service: DebtService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [MoneyIoTestModule],
        declarations: [DebtUpdateComponent],
        providers: [FormBuilder]
      })
        .overrideTemplate(DebtUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(DebtUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(DebtService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new Debt(123);
        spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
        comp.updateForm(entity);
        // WHEN
        comp.save();
        tick(); // simulate async

        // THEN
        expect(service.update).toHaveBeenCalledWith(entity);
        expect(comp.isSaving).toEqual(false);
      }));

      it('Should call create service on save for new entity', fakeAsync(() => {
        // GIVEN
        const entity = new Debt();
        spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
        comp.updateForm(entity);
        // WHEN
        comp.save();
        tick(); // simulate async

        // THEN
        expect(service.create).toHaveBeenCalledWith(entity);
        expect(comp.isSaving).toEqual(false);
      }));
    });
  });
});
