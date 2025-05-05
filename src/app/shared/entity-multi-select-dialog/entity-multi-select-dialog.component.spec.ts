import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntityMultiSelectDialogComponent } from './entity-multi-select-dialog.component';

describe('EntityMultiSelectDialogComponent', () => {
  let component: EntityMultiSelectDialogComponent;
  let fixture: ComponentFixture<EntityMultiSelectDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntityMultiSelectDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EntityMultiSelectDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
