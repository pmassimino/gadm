import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutEntityComponent } from './layout-entity.component';

describe('LayoutEntityComponent', () => {
  let component: LayoutEntityComponent;
  let fixture: ComponentFixture<LayoutEntityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LayoutEntityComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LayoutEntityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
