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
