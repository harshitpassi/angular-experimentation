# Angular and Forms

- Angular gives you a JSON representation of a form and it's related metadata, to allow you to work with it.
- Two approaches to creating forms with Angular:
    - Template Driven : Angular infers the form object from the DOM
    - Reactive : Form is created programmatically and synchronized with the DOM

## 1. Template Driven Approach

- First, make sure you import the FormsModule in your app module.
- With that, as soon as Angular sees a `form` tag in the template, it will create a JSON representation of the form.
- Angular however, does not add all the inputs by default.
- Hence, we need to register inputs within a form element. To to this, we simply need to add the `ngModel` directive to the input element.
- Furthermore, we need to put in a `name` attribute, to tell Angular what the name of the element should be in its JSON representation.
```html
<input type="text" id="username" class="form-control" ngModel name="username">
```
- To react to the form being submitted, Angular also gives us the `ngSubmit` directive, which has an event we can handle.
- Also, to get a reference to the form object, we can use a local reference on the form element.
```html
<form (ngSubmit)="onSubmit(loginForm)" #loginForm>
```
```ts
onSubmit(form: HTMLFormElement) {
    console.log(form);
}
```
- This will give us the actual Form Element, rather than just a JSON representation of the form.
- To get that, we need to add ngForm to the local ref value.
```html
<form (ngSubmit)="onSubmit(loginForm)" #loginForm="ngForm">
```
```ts
onSubmit(form: NgForm) {
    console.log(form);
  }
```
- This form object represents our form state. Some important properties:
    - controls : an array of all the form controls registered on our form, with detailed representation
    - dirty, disabled, enabled, errors
    - dirty is true whenever you type into any field on the form.
    - invalid, valid : depend on validators.
    - touched/untouched :  whether the user clicked in on any field.
    - value :  object with key-value pairs of field names and values.
- This form reference can also be accessed through `@ViewChild`.
```ts
@ViewChild('signupForm') signupForm: NgForm;
```
- This means that we can get a reference to our form before submitting it.

### Adding Validations

- For template driven approach, add validators in the template.
- `required` for required fields.
- `email` directive is also available for validating email addresses.
- validity/dirty-pristine/touched-untouched is tracked on both a form level and a control level in the controls property of the form object.
- Angular also adds 3 classes on the form as well as every form control to signify the form state:
    - ng-dirty or ng-pristine
    - ng-touched or ng-untouched
    - ng-valid or ng-invalid
- These classes are added and removed dynamically by Angular, based on the form state.
- Directive validators available in Angular:
    - required, email, CheckboxRequiredValidator(automatically used when required is placed on checkbox)
    - maxlength, minlength
    - ```html
        <input name="firstName" ngModel maxlength="25">
    ```
    - pattern : uses a regex pattern to validate - `<input name="firstName" ngModel pattern="[a-zA-Z ]*">`

- Additionally, we can enable native HTML5 form validation by using the `ngNativeValidate` directive on a form control.

### Using the form State

- Diabling the submit button if form isn't valid:

```html
<button class="btn btn-primary" type="submit" [disabled]="!signupForm.valid">Submit</button>
```

- Styling based on form state:

```css
.ng-invalid.form-control.ng-touched {
    border: 1px solid red;
}
```

- Outputting validation error messages:

```html
<input type="email" id="email" class="form-control" ngModel name="email" required email #email="ngModel">
<span class="help-block" *ngIf="!email.valid && email.touched">Please enter a valid email!</span>
```

- Default values with ngModel property binding:
```ts
defaultQuestion = 'pet';
```
```html
<select id="secret" class="form-control" [ngModel]="defaultQuestion" name="secret" required>
```

- Instantly react to changes with 2 way data binding:
```html
<div class="form-group">
    <textarea class="form-control" name="questionAnswer" [(ngModel)]="answer" rows="3"></textarea>
    <p>Your reply: {{answer}}</p>
</div>
```

- Grouping together form controls, getting access to ng-touched/valid/dirty type classes on a group:
```html
<div id="user-data" ngModelGroup="userData" #userData="ngModelGroup">
    <div class="form-group">
        <label for="username">Username</label>
        <input type="text" id="username" class="form-control" ngModel name="username" required>
    </div>
    <button class="btn btn-default" type="button">Suggest an Username</button>
    <div class="form-group">
        <label for="email">Mail</label>
        <input type="email" id="email" class="form-control" ngModel name="email" required email #email="ngModel">
        <span class="help-block" *ngIf="!email.valid && email.touched">Please enter a valid email!</span>
    </div>
    <p class="help-block" *ngIf="!userData.valid && userData.touched" >User Data is Invalid</p>
</div>
```

- Adding radio buttons:
```html
<div class="form-group">
    <div class="radio" *ngFor="let gender of genders">
        <label>
            <input type="radio" name="gender" [value]="gender" ngModel required> {{gender}}
        </label>
    </div>
</div>
```

- We can set the value of the entire form in the component ts file by using the `setValue()` property, which takes an object that is the entire form-value object.
- `setValue()` sets values on the entire form, to modify one or the other values, we can use `form.patchValue()`

```ts
suggestUserName() {
    const suggestedName = 'Superuser';
    this.signupForm.form.patchValue({
      userData: {
        username: suggestedName
      }
    });
  }
```

- We can access the values of all of our fields using the `@ViewChild` of the form object and using the value object. We can also reset the form using the `reset()` method on the object.
- `reset()` will also empty out the entire state, including the dirty, touched, valid properties.

