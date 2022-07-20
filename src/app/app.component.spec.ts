import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed,ComponentFixture } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxPaginationModule } from 'ngx-pagination';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let fixture : ComponentFixture<AppComponent>;
  let component:  AppComponent;
  let de: DebugElement;
  let el: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        ReactiveFormsModule, 
        FormsModule,
        NgxPaginationModule 
      ],
      schemas: [ NO_ERRORS_SCHEMA ],
      declarations: [
        AppComponent,
      ],
    }).compileComponents().then(() => {
      fixture = TestBed.createComponent(AppComponent);
      fixture.detectChanges();
      component = fixture.componentInstance;
      
    });
  });

  it('should create the app', () => {
    
    expect(component).toBeTruthy();
  });

  it('Set Input type text value', async () => {
    const phoneNum = fixture.debugElement.query(By.css('input'));
    phoneNum.nativeElement.value = '99999999';
    phoneNum.nativeElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    fixture.whenStable().then(() => { 
      fixture.detectChanges(); 
      console.log('sendInput : ', phoneNum.nativeElement.value);
      expect(phoneNum.nativeElement.value).toContain('99999999');
    });
  });

  it('phone field validity', () => {
    component.ngOnInit();
    const phone = component.form.controls['phoneNum'];
    expect(phone.valid).toBeFalsy();

    phone.setValue('');
    expect(phone.hasError('required')).toBeTruthy();
  });

  it('phone field validity less than 7 numbers', () => {
    component.ngOnInit();
    const phone = component.form.controls['phoneNum'];
    expect(phone.valid).toBeFalsy();

    phone.setValue('99999');
    expect(phone.hasError('minlength')).toBeTruthy();
  });

  it('phone field valid', () => {
    component.ngOnInit();
    spyOn(component,'generateNumberList');
    const phone = component.form.controls['phoneNum'];
    const button = fixture.debugElement.query(By.css('#button'));
    const totalCount = fixture.debugElement.query(By.css('.totalCount'));
    expect(phone.valid).toBeFalsy();

    phone.setValue('99999999'); 
    button.nativeElement.click();
    fixture.detectChanges();
  
    expect(phone.valid).toBeTruthy();
    fixture.whenStable().then(() => { 
      fixture.detectChanges(); 
      expect(phone.value).toContain('99999999');
      console.log(component.numberList.length);
      expect(component.numberList.length==10).toBeTruthy;
      expect(component.generateNumberList()).toHaveBeenCalled;
    });    
  }); 
 
});
