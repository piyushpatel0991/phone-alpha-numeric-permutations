import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  form!: FormGroup;
  submitted = false;
  letters: string[] = ['0', '1', '2ABC', '3DEF', '4GHI', '5JKL', '6MNO', '7PQRS', '8TUV', '9WXYZ'];
  startIndexes: number[] = [];
  numberList: string[] = [];
  totalCount = 0;
  currentPage = 0;
  totalPages = 0;
  displayList= false;

  constructor(private formBuilder: FormBuilder) { }
  
  validate(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
  ngOnInit() {
    this.form = this.formBuilder.group({
      phoneNum: ['', [Validators.required,
      Validators.pattern("^[0-9]*$"),
      Validators.minLength(7), Validators.maxLength(10)]]
    });
    this.onChanges();
  }
  

  get f() { 
    return this.form.controls; 
  }

  onSubmit() {
    this.submitted = true;
    console.log("submit clicked");
    if (this.form.invalid) {
      return;
    }else{
      this.generateNumberList();
    }

  }

  getCount(phoneNum: string) {
    let total = 1;
    let i: number;
    const num: string[] = phoneNum.split('');
    for ( i = 0; i < num.length; i++ ) {
        total = total * this.letters[num[i] as unknown as number ].length;
    }
    return total;
  }

  generateNumberList() {
    if ( this.form !=null &&  !this.form?.get('phoneNum')?.errors ){
      this.currentPage =1;
      this.numberList = this.getPage(this.form?.get('phoneNum')?.value, 10, this.currentPage);
      console.log('--->'+this.numberList);
      this.displayList = true;
      this.totalPages = Math.ceil(this.totalCount / 10);
    }else{
      this.numberList = [];
      this.displayList = false;
      this.totalPages = 0; 
    }
  }

  onNextPage(page: number) {
    this.currentPage = page;
    this.numberList = this.getPage(this.form?.get('phoneNum')?.value, 10, page );
  }

  get phoneNum() {
    return this.form?.get('phoneNum');
  }
  
  onChanges(): void {
    this.form?.get('phoneNum')?.valueChanges.subscribe((val) => {
        this.totalCount = (!this.form?.get('phoneNum')?.errors
                           && this.form?.get('phoneNum')?.value !== ''
                           && !this.form?.pristine) ? this.getCount(this.form?.get('phoneNum')?.value) : 0;
        this.totalPages = Math.ceil(this.totalCount / 10);
        this.numberList = [];
        this.displayList = false;
    });
  }

  convertedAlphaNumericText(number: any[], element: number, index: number ) : any {
    if (index < number.length) {
        const separator = (index === 3 || index === 6) ? ' ' : '';
        return this.convertedAlphaNumericText(number, Math.floor(element / (this.letters[number[index]].length)), ++index) + '' +
        separator +
        (this.letters[number[index - 1]].split(''))[element % (this.letters[number[index - 1]].length)];
    } else {
        return '';
    }
  }

  getPage(phoneNum: string, pagesize: number, page: number) {
    const reversedNumber: string[] = phoneNum.split('').reverse();
    this.startIndexes = new Array(reversedNumber.length);
    page = ( page - 1 < 0) ? 0 : page - 1;
    const list: string[] = new Array();

    const totalCount = this.getCount(phoneNum);

    const numberOfPages = (((pagesize * page) + pagesize) > totalCount) ?
        totalCount :
        ((pagesize * page) + pagesize);

    for (let i = pagesize * page; i < numberOfPages; i++ ) {
      list.push(this.convertedAlphaNumericText(reversedNumber, i, 0));
    }

    return list;
  }


}