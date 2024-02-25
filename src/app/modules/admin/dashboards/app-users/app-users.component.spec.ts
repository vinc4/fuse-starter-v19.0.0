import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppUsersComponent } from './app-users.component';

describe('AppUsersComponent', () => {
  let component: AppUsersComponent;
  let fixture: ComponentFixture<AppUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppUsersComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AppUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
