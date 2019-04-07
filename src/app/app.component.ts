import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChild('signupForm') signupForm: NgForm;
  defaultQuestion = 'teacher';
  answer = '';
  genders = ['Male', 'Female', 'Others']


  suggestUserName() {
    const suggestedName = 'Superuser';
    this.signupForm.form.patchValue({
      userData: {
        username: suggestedName
      }
    });
  }

  // onSubmit(form: NgForm) {
  //   console.log(form);
  // }

  onSubmit() {
    console.log(this.signupForm);
  }
}
