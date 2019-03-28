# Services

- used to remove code duplication and to provide data between multiple components.
- Acts as a repository to centralize code and data
- a service is just a normal typescript class, and can be used without any decorators:
```ts
export class LoggingService {
    logStatusChange(change: string) {
        console.log(`A server status changed, new status: ${status}`);
    }
}
```
- this is a perfectly viable service.

## 1. Hierarchical Injector

- To use a service in a component, we use Angular's dependency injector.
- Angular automatically injects instances of dependencies into components that need them.
- You only need to specify in a component/directive's constructor that you require an instance of a particular service.
- Additionally, we need to provide the service itself to Angular by mentioning it in the providers array of a component's metadata
```ts
import { Component, EventEmitter, Output } from '@angular/core';
import { LoggingService } from '../logging.service';

@Component({
  selector: 'app-new-account',
  templateUrl: './new-account.component.html',
  styleUrls: ['./new-account.component.css'],
  providers: [LoggingService]
})
export class NewAccountComponent {
  @Output() accountAdded = new EventEmitter<{name: string, status: string}>();

  constructor( private loggingService: LoggingService ) {}

  onCreateAccount(accountName: string, accountStatus: string) {
    this.accountAdded.emit({
      name: accountName,
      status: accountStatus
    });
    this.loggingService.logStatusChange(accountStatus);
  }
}
```

- The heirarchical injector injects the same instance of a service to a component and all its child and grand-child components. Hence, the service only needs to be provided in a parent component.
- Where to inject:
  - AppModule : The same instance of the service is available application-wide.
  - AppComponent : Available to all components, but not to services. (services can be injected in services)
  - Any other component : Only the component and its children.
- The injector does not inject upwards through the hierarchy. I.e a service instance injected in a child component will not be available in the parent component.

- Parent component:
```ts
import { Component, OnInit } from '@angular/core';
import { AccountService } from './account.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [AccountService]
})
export class AppComponent implements OnInit {
  accounts: {name: string, status: string}[] = [];

  constructor(private accountService: AccountService) {}

  ngOnInit() {
    this.accounts = this.accountService.accounts;
  }
}
```

- Child component:
```ts
import { Component } from '@angular/core';
import { LoggingService } from '../logging.service';
import { AccountService } from '../account.service';

@Component({
  selector: 'app-new-account',
  templateUrl: './new-account.component.html',
  styleUrls: ['./new-account.component.css'],
  providers: [LoggingService]
})
export class NewAccountComponent {

  constructor( private loggingService: LoggingService, private accountService: AccountService ) {}

  onCreateAccount(accountName: string, accountStatus: string) {
    this.accountService.addAccount(accountName, accountStatus);
    this.loggingService.logStatusChange(accountStatus);
  }
}
```

- **Note:** We did not need to provide the service in the providers array of the child component.
- Since AccountService is a data service, if we provided it in the child component as well as the parent, we would not receive the same instance of the data.
- This would mean that any updates from the child component would not be reflected in the data displayed in the parent component.

## 2. Services injected inside other Services

- To inject a service into other services, we need to provide it in the AppModule.
- Also, to inject a service into anything, it needs to have a decorator with some metadata associated with it to bring it into Angular's context.
- For other services, it is `@Injectable`. You don't need to add it to the service you want to inject, but the service receiving the injection.
- We only need to add `@Injectable()` to a service if we expect it to need another service.

```ts
@Injectable()
export class AccountService
```

## 3. Services for Cross-Component Communication

- We can specify `EventEmitter`s in services, which can be emitted and listened to across components.

- **Service:**
```ts
statusUpdated = new EventEmitter<string>();
```
- **Component 1:**
```ts
onSetTo(status: string) {
    this.accountService.updateStatus(this.id, status);
    this.accountService.statusUpdated.emit(status);
  }
```
- **Component 2:**
```ts
this.accountService.statusUpdated.subscribe(
    (status: string) => alert(`New status ${status}`)
);
```

- We can subscribe to events emitted by EventEmitter as it is only a wrapper for Observables.
- This flow would have taken multiple property and event bindings to implement without the service.

## 4. Services in Angular 6+

- From Angular 6+ we can set `@Injectable({providedIn: 'root'})` on a service to make itavailable application-wide.
- This is the same as adding the service in the `providers` array of the AppModule.
- Additionally, it allows services to be loaded lazily, leading to better performance and loading speed.

