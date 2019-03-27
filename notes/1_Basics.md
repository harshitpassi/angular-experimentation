# 1. Basics
## 1.1 How Angular gets loaded
- `index.html` is served by the dev server
- `AppComponent` is the root component of the entire application. Its selector is `app-root`. It is used inside the body of `index.html`.
- All the Angular code gets bundled by the Angular CLI and added to the final `index.html` file served.
- `main.ts` contains the first code that is executed as soon as the Angular project is served. It bootstraps the application by passing the `AppModule` to `platformBrowserDynamic().bootstrapModule()`.
- The `AppModule` contains a bootstrap array with all the components that should be known to Angular when the application is bootstrapped.
## 1.2 Component basics
- `AppComponent` is the root component of the app, all other components are added to its template HTML.
- Each component is a TypeScript class. It needs to be exported so that it can be added to the module.
- We need to tell Angular that the class in particular is a component, so we use the @Component decorator, to provide metadata about the configuration of the component.
- the `@Component` decorator needs to be imported from the `@angular/core` package.
- the decorator needs to be passed a configuration object. Selectors must be unique:
  ```ts
  @Component({
    selector: 'app-server',
    templateUrl: './server.component.html'
  })
  ```
## 1.3 Module basics
- Modules are bundles of functionality. Modules contain metadata to let Angular know which features the application has and uses.
- We use the `@NgModule` decorator to specify that a class is an NgModule.
  ```ts
  @NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
  ```
- Any new components have to be registered in the NgModule decorator to tell Angular that it exists and is a part of the specified module.
  - declarations is the set of components that belong to the module.
  - imports is the set of other modules that this module uses.
## 1.4 Using Custom Components
- You can simply use the selector once the component is declared or imported in your module.
  ```html
  <hr>
  <app-server></app-server>
  ```
- Can also use angular-cli to create a new component using `ng generate component <component-name>` or `ng g c <component-name>`. This will also automatically take care of importing and declaring the component in the module file.
## 1.5 Component Templates
- Can also do inline templating of components by using `template` property in the `@Component` metadata instead of `templateUrl`.
  ```ts
  @Component({
  selector: 'app-servers',
  template: `
    <app-server></app-server>
    <app-server></app-server>
  `,
  styleUrls: ['./servers.component.css']
  })
  export class ServersComponent{}
  ```
## 1.6 Component Styling
- `styleUrls` is an array of external stylesheets that define the style for your component.
- you can also use inline styles with the `styles` property.
  ```ts
  @Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  //styleUrls: ['./app.component.css']
  styles: [`
    h3 {
      color: dodgerblue;
    }
  `]
  })
  export class AppComponent {
    name = '';
  }
  ```
- A component must have only one template, either inline or external.
- It can have multiple styles.
## 1.7 Component Selector
- must be unique to not override another component.
- the selector field of a component's metadata works exactly like CSS selectors.
- this means that it's not mandatory to use an element selector. One can also use an attribute selector by enclosing the selector in `[app-selector]` or by class with a `.` in front of it.
  ```ts
  @Component({
  //selector: 'app-servers',
  //selector: '[app-servers]',
  selector: '.app-servers',
  template: `
    <app-server></app-server>
    <app-server></app-server>
  `,
  styleUrls: ['./servers.component.css']
  })
  export class ServersComponent
  ```
  ```html
      <div class="col-xs-12">
            <!-- <app-servers></app-servers> -->
            <!-- <div app-servers></div> -->
            <div class="app-servers"></div>
        </div>
  ```
  - this would essentially work the same.
  - for components, we typically use element selectors.
## 1.8 Databinding overview
- Databinding is the shuttling of data between TS code and HTML template.
- To output data from TS to HTML, we use:
  - String interpolation : `{{ data }}`
  - Property binding : `[property] = "data"`
- For HTML to TS communication, we can react to user events using event binding `(event)="expression"`.
- Two way data binding `[(ngModel)]="data"`
## 1.9 String Interpolation
- `{{ value/expression }}`
- String interpolation can contain any expression that can evaluate to a string in the end.
- no multiline expressions. No if-else, use ternary operators instead.
## 1.10 Property Binding
- Square brackets indicate that we are using property binding. This tells Angular to evaluate the value of an attribute as a typescript expression.
- `<button [disbaled]="isButtonDisabled()" >Test</button>`
- We can also bind to the `innerText` property of an element instead of using string interpolation:
  ```html
  <p> {{ someValue }} </p>
  <p [innerText]="someValue"></p>
  ```
  - these are equivalent in functionality.
## 1.11 Event Binding
- parantheses enclose an event. The value is a javascript expression.
    ```ts
    <button class="btn btn-primary"
    [disabled]="!allowNewServer"
    (click)="onCreateServer()"> Add Servers </button>
    ```
- can also pass event data to the event handler function using `$event`. `$event` is a reserved variable name for data passed through an event.
    ```ts
    onUpdateServerName(event: Event){
      this.serverName = (<HTMLInputElement>event.target).value;
    }
    ```
    ```html
    <input type="text" class="form-control" (input)="onUpdateServerName($event)">
    ```
## 1.12 Two-way-databinding
- Combination of property binding and event binding, with the use of the ngModel directive.
```html
<input type="text" class="form-control" [(ngModel)]="serverName">
<p>{{ serverName }}</p>
```
- will also change the value of the input element if the value of the model in TS changes.
## 1.13 Directives 
- Directives: instructions for the DOM
  - Components = directives + template
  - Structural directives = change the DOM layout by adding or removing elements
  - attribute directives = change the appearance or functionality of DOM elements
- Use `@Directive` decorator to define a custom directive.
## 1.14 ngIf
- `*ngIf` is used as the attribute.
- * at the beginning indicates it is a structural directive.
- it is a structural directive since it changes whether an element should be added to the DOM or not.
- its value should be an expression returning a boolean value.
- `<p *ngIf="serverCreated"> Server was created. Server name is: {{ serverName }} </p>`
- `serverCreated : boolean = false;`
## 1.15 else for ngIf
```html
<p *ngIf="serverCreated; else noServer"> Server was created. Server name is: {{ serverName }} </p>
<ng-template #noServer>
    <p> No Server was created. </p>
</ng-template>
```
## 1.16 ngStyle
- attribute directive. Without * in it.
- need to give it a value, so we will need to bind it to a js expression.
- `[ngStyle]="{backgroundColor: getColor()}"`. Square brackets indicate that we are binding to the ngStyle property on the ngStyle directive.
- The property expects a js object, where keys are the styles to apply and values are their values.
## 1.17 ngClass
- dynamically adds or removes CSS classes.
- same as ngStyle, takes a js object as input.
- Object keys are CSS classes, values are expressions that evaluate to a boolean value indicating whether the class shoulf be applied or not.
- `[ngClass]="{'online' : serverStatus === 'Online'}"`
## 1.18 ngFor
- replicates a DOM element based on an array.
- `<app-server *ngFor="let server of servers"></app-server>`
- Can also get current index:
  ```html
  <div *ngFor="let log of logArray; let i = index">
  ```
