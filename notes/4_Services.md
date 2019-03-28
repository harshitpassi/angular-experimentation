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

## Hierarchical Injector

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
