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

## 3. Navigation Paths

- With the `routerLink` directive, if you add a '/' it turns into an absolute path of type '<domain>/servers', but without a '/' it assumes it to be a relative path.
- We can also use relative paths with './' in the beginning. We can also navigate as if we're inside a directory, with '../servers'. With '../' it doesn't just remove one segment from the path, but removes the currently loaded segment in its entirety.

## 4. Styling Active router Links

- we can use the `routerLinkActive` directive to pass in a class that would be applied to a router link when it is the active path.
- By default `routerLinkActive` also applies the CSS class if the link includes the parent path of the current path, i.e.:

```html
  <div class="row">
    <div class="col-xs-12 col-sm-10 col-md-8 col-sm-offset-1 col-md-offset-2">
      <ul class="nav nav-tabs">
        <li role="presentation" routerLinkActive="active"><a routerLink="/">Home</a></li>
        <li role="presentation" routerLinkActive="active"><a routerLink="/servers">Servers</a></li>
        <li role="presentation" routerLinkActive="active"><a [routerLink]="['/users']">Users</a></li>
      </ul>
    </div>
  </div>
```

- This would apply the `active` class to Home as well as Users if you are on '/users'.
- To fix this we would need to add a `routerLinkActiveOptions` directive:

```html
<li role="presentation" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}"><a routerLink="/">Home</a></li>
```

## 5. Programmatic Navigation

```html
<button class="btn btn-primary" (click)="onLoadServers()">Load Servers</button>
```

```ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  onLoadServers() {
    // complex calculation
    this.router.navigate(['/servers']);
  }

}
```

- the `routerLink`directive always knows the current path, while `Router` does not, when it's inside the component. Any relative path given to `this.router.navigate` is only relative to the root domain itself.
- in order to make it ruly relative, we need to pass the current path to the navigate method. We can do this by injecting the 'ActivatedRoute` route.
```ts
import { Router, ActivatedRoute } from '@angular/router';

constructor(private serversService: ServersService, private router: Router, private route: ActivatedRoute) { }

onReload() {
    this.router.navigate(['servers'], {relativeTo: this.route});
  }
```

## 6. Route Parameters

- Can add paramters to a route using `/:param`, where param is the name of the parameter you want to retrieve.
```ts
const appRoutes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'users', component: UsersComponent},
  {path: 'users/:id', component: UserComponent},
  {path: 'servers', component: ServersComponent}
];
```
- the `:` tells Angular that this is the dynamic part of the path.
- To retrieve route parameters, we can use the `snapshot.params` property of the ActivatedRoute:
```ts
ngOnInit() {
    this.user = {
      id: this.route.snapshot.params['id'],
      name: this.route.snapshot.params['name']
    };
}
```
## 7. Fetching Route Parameters Reactively

- If you are already on an initialized component and need to load something different in the route parameter, Angular will not re-instantiate the component and the data from the snapshot will not change. The address bar would be updated, but the new data will not be given to the component from the parameters.
- there is another `ActivatedRoute.params` property that is an observable, and can be subscribed to.
```ts
    this.route.params.subscribe((params: Params) => {
      this.user = {
        id: params['id'],
        name: params['name']
      };
    });
```
- the snapshot approach is still fine for initialization.
- **IMPORTANT!** Angular automatically cleans up its own observable subscriptions whenever a component is destroyed. However, if you create your own observable, you should unsubscribe it in the ngOnDestroy method.

## 8. Query Parameters and Fragments

