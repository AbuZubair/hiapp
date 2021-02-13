import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CreateVictimPage } from './create-victim.page';

describe('CreateVictimPage', () => {
  let component: CreateVictimPage;
  let fixture: ComponentFixture<CreateVictimPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateVictimPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CreateVictimPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
