# Route Guards

## 1. Intro

- Code that is executed before a route is loaded or exited.
- For instance, if we want to check whether a user is logged in before accessing a specific feature. Adding that check on the onInit of every component would be cumbersome.

## 2. Route Protection with canActivate

- example auth guard implementation:

```ts
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { AuthService } from 'src/auth.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router) {}
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        return this.authService.isAuthenticated().then((authenticated: boolean) => {
            if ( authenticated ) {
                return true;
            } else {
                this.router.navigate(['/']);
            }
        });
    }
}
```

- to use this guard, we would need to add it to the canActivate property of the route that needs it. canActivate takes an array of all the guards you want to specify on a route.
- It is automatically applied to all child routes.
```ts
    {path: 'servers', canActivate: [AuthGuard], component: ServersComponent, children: [
      {path: ':id', component: ServerComponent},
      {path: ':id/edit', component: EditServerComponent}
    ]}
```

## 3. Protecting Child Routes with canActivateChild

- Involves implementing the `CanActivateChild` interface in your guard:

```ts
canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        return this.canActivate(route, state);
    }
```

- Now our AuthGuard can serve both `canActivate` and `canActivateChild` properties in the route:

```ts
    {
        path: 'servers',
        // canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: ServersComponent,
        children: [
            {path: ':id', component: ServerComponent},
            {path: ':id/edit', component: EditServerComponent}
        ]
    },
```

## 4. Controlling Navigation with canDeactivate

- For executing code when a user is leaving a route. Examples like user has changed a form field and clicked back, so we want to show an alert asking the user whether they're sure.
- the `CanDeactivate` interface is generic as it needs a custom interface to configure the component whose method is to be called when leaving the page.
- First we need to make such an interface:

```ts
export interface CanComponentDeactivate {
    canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
}
```
- Then we need to use it while implementing the `CanDeactivate` generic interface:
```ts
@Injectable({
    providedIn: 'root'
})
export class CanDeactivateGuard implements CanDeactivate<CanComponentDeactivate> {

    canDeactivate(component: CanComponentDeactivate,
         route: ActivatedRouteSnapshot, currentState: RouterStateSnapshot, nextState?: RouterStateSnapshot):
         Observable<boolean> | Promise<boolean> | boolean {
            return component.canDeactivate();
    }
}
```
- This basically means that this guard will call the `canDeactivate()` method of the component that implements our custom `CanComponentDeactivate` interface.
```ts
export class EditServerComponent implements OnInit, CanComponentDeactivate {
    canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (!this.allowEdit) {
      return true;
    }
    if ((this.serverName !== this.server.name || this.serverStatus !== this.server.status) && !this.changesSaved) {
      return confirm('Are you sure you want to discard your changes?');
    } else {
      return true;
    }
  }
}
```
- Finally, we also need to configure our guard in the route configuration:
```ts
{path: ':id/edit', component: EditServerComponent, canDeactivate: [CanDeactivateGuard]}
```

## 5. Passing Static Data to Routes

- We can pass static data to a component (like a widget heading if we're using a component to make multiple widgets) using the `data` route property.
```ts
{path: 'not-found', component: ErrorPageComponent, data: {message: 'Page not Found!'}},
```

- this can be consumed using the `data` property of the router snapshot, or by subscribing to the data observable:

```ts
ngOnInit() {
    this.errorMessage = this.route.snapshot.data['message'];
    this.route.data.subscribe((data: Data) => {
      this.errorMessage = data['message'];
    });
  }
```

## 6. Resolving dynamic data with the Resolve guard

- Resolve guard can dynamically load some data even before a component is rendered.
- unlike canActivate, it WILL eventually load the component, it will just load some data first.

- first, we need to create a resolver that will fetch the data:
```ts
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { ServersService } from './servers.service';
import { Injectable } from '@angular/core';

interface Server {
    id: number;
    name: string;
    status: string;
}

@Injectable({
    providedIn: 'root'
})
export class ServerResolver implements Resolve<Server> {

    constructor(private serversService: ServersService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Server> | Promise<Server> | Server {
        return this.serversService.getServer(+route.params['id']);
    }
}
```
- Here, we only get the route snapshot rather than the entire route, but that is fine since the resolver is executed every time the route is changed, so we don't need to subscribe to the params observable.
- Next, we need to put this resolver in the route configuration:
```ts
{path: ':id', component: ServerComponent, resolve: {server: ServerResolver}},
```
- Finally, this data is available in the `data` property and observable of the component we load:
```ts
ngOnInit(){
    this.route.data.subscribe((data: Data) => {
      this.server = data['server'];
    });
}
```