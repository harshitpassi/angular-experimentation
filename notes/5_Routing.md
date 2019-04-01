# Routing

## 1. Setup

- Routes are instantiated using the `Routes` type from `@angular/router`.
```ts
import { Routes } from '@angular/router';

const appRoutes: Routes = [];
```

- Each route is a JS object with the fololowing mandatory properties:
  - `path`: the path to navigate a particular route. (without `/`)
  - `component`: The component to be loaded when the path is specified.

```ts
const appRoutes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'users', component: UsersComponent},
  {path: 'servers', component: ServersComponent}
];
```

- To register these routes, we would need to import the `RouterModule` in our app component.
- The `RouterModule`has a method called `forRoot()` which can be used to register specific routes for an application.

```ts
import { Routes, RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    UsersComponent,
    ServersComponent,
    UserComponent,
    EditServerComponent,
    ServerComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [ServersService],
  bootstrap: [AppComponent]
})
```

- Finally, we need to inform Angular about where we need to render the component for a selected path. This is done by specifying the `router-outlet` directive at the desired location in the app.
```html
<!-- app.component.html -->
  <div class="row">
    <div class="col-xs-12 col-sm-10 col-md-8 col-sm-offset-1 col-md-offset-2">
      <router-outlet></router-outlet>
    </div>
  </div>
```

- At this point, manually visiting the '/users' and '/servers' path would load the respective components.

## 2. Router Links

```html
  <div class="row">
    <div class="col-xs-12 col-sm-10 col-md-8 col-sm-offset-1 col-md-offset-2">
      <ul class="nav nav-tabs">
        <li role="presentation" class="active"><a href="/">Home</a></li>
        <li role="presentation"><a href="/servers">Servers</a></li>
        <li role="presentation"><a href="/users">Users</a></li>
      </ul>
    </div>
  </div>
```

- adding raw paths to href attributes would seem like it's working, but it is incorrect.
- This approach reloads the entire page. This means that the app is restarted on every navigation action. App state would also be lost, and it'll be much slower.
- Instead Angular gives us a directive called `routerLink` which is able to parse a string to create a path.
- We can also use `routerLink` with property binding, where you can specify an array with path segments.

```html
  <div class="row">
    <div class="col-xs-12 col-sm-10 col-md-8 col-sm-offset-1 col-md-offset-2">
      <ul class="nav nav-tabs">
        <li role="presentation" class="active"><a routerLink="/">Home</a></li>
        <li role="presentation"><a routerLink="/servers">Servers</a></li>
        <li role="presentation"><a [routerLink]="['/users']">Users</a></li>
      </ul>
    </div>
  </div>
```




