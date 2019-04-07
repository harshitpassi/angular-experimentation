# Understanding Observables

- For Angular purposes, it is a data source that follows the Observer pattern.
- There's a stream of data coming from an Observable, that is subscribed to by an observer.
- An observer has three ways of handling a data package in the stream of an observable:
    - Handle normal data
    - Handle error
    - Handle completion
- Completion is optional. Many Observables (like those hooked up to button events) never complete.
- Others, like for HTTP requests do complete eventually.

## 1. The Params Observable

- As we saw in the routing section, Angular doesn't re-initialize a component when the path changes. That's why if you just extract a parameter from the route snapshot in ngOnInit and then dynamically change the path, your parameters would not be updated.
- Instead, Angular uses an Observable to send any updates to the parameters, that you can subscribe to for updated values:
```ts
this.route.params
      .subscribe(
        (params: Params) => {
          this.id = +params['id'];
        }
    );
```

- Here, we have only handled the normal data callback.
- The subscribe method on an Observable takes three arguments, one callback each for normal data, error and completion respectively.
- In the params observable though, it doesn't make much sense since it will not fail or complete.

## 2. Custom Observables

- Very simple observable:
```ts
const myNumbers = Observable.interval(1000);
myNumbers.subscribe((num: number) => console.log(num));
```

- this creates an observable which emits a number every second. On subscribing to it, we just pring it out.

- From scratch:

```ts
const myObservable = Observable.create((observer: Observer<string>) => {
      setTimeout( () => observer.next('first data packet'), 2000);
      setTimeout( () => observer.next('second data packet'), 4000);
      // setTimeout( () => observer.error('Failed and thrown error'), 5000);
      setTimeout( () => observer.complete(), 5000);
      setTimeout( () => observer.next('third data packet'), 6000); // Never emitted as the Observable is completed before it.
    });

    myObservable.subscribe( (str: string) => console.log(str), // normal data
      (e: string) => console.log(e), // error handling
      () => console.log('Completed') ); // completion handling
```

- `Observable.create` creates an observable. It takes a callback which defines what data the subscriber will receive and when.
- The callback to `Observable.create()` receives an `Observer` as an argument. `Observer` is a generic type, so we have to specify the type of data the observable will emit in it.
- `Observer.next` emits a value from the Observable.
- `Observer.error` emits an error.
- `Observer.complete` marks it as complete, but does not emit any value.
- Once `complete()` or `error()` are called, the observer finishes executing, and no more data packets are sent, hence the third data packet in the example will never reach the subscriber.

## 3. Unsubscribing Observables

- The simple interval Observable we defined never completed or errored out. It will infinitely keep counting.
```ts
const myNumbers = Observable.interval(1000);
myNumbers.subscribe((num: number) => console.log(num));
```

- This would happen even if you navigate away from the page and the component in which this observable is defined is destroyed. As long as the application is alive, it will keep emitting values.
- This will create a memory leak.
- Hence, we must unsubscribe custom observables any time we leave the are in which they're declared.
- For Angular components, this means calling unsubscribe on the observable in ngOnDestroy.
- The `Observable.subscribe()` method returns another rxjs object called `Subscription` which has the `Subscription.unsubscribe()` method on it.

```ts
export class HomeComponent implements OnInit, OnDestroy {
  mySubscription: Subscription;

  constructor() { }

  ngOnInit() {
    // const myNumbers = Observable.interval(1000);
    // myNumbers.subscribe((num: number) => console.log(num));

    const myObservable = Observable.create((observer: Observer<string>) => {
      setTimeout( () => observer.next('first data packet'), 2000);
      setTimeout( () => observer.next('second data packet'), 4000);
      setTimeout( () => observer.error('Failed and thrown error'), 5000);
      // setTimeout( () => observer.complete(), 5000);
      setTimeout( () => observer.next('third data packet'), 6000); // Never emitted as the Observable is completed before it.
    });

    this.mySubscription = myObservable.subscribe( (str: string) => console.log(str), // normal data
      (e: string) => console.log(e), // error handling
      () => console.log('Completed') ); // completion handling
  }

  ngOnDestroy() {
    this.mySubscription.unsubscribe();
  }

}
```

- Angular's own Observables will unsubscribe themselves. For all others, we need to explicitly unsubscribe.

## 4. Subjects

- Subjects work as both Observables and Observers.
- This means that through them you can push values as well as subscribe to them.
- For cross component communication, they work like even emitters, as EventEmitter is based on Subjects.
- Service with a subject:
```ts
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class UsersService {
    userActivated = new Subject();
}
```

- Emitting a value:
```ts
onActivate() {
    this.usersService.userActivated.next(this.id);
  }
```

- Subscribing to it in another component:
```ts
this.userActivationSubscription = this.usersService.userActivated.subscribe( (id: number) => {
      switch (id) {
        case 1 : this.user1Activated = true;
        break;
        case 2 : this.user2Activated = true;
        break;
      }
    } );
```

## 5. Observable operators

- Observable operators transform the values of an Observable as the stream goes through them. Similar to array functions like map/filter/reduce. They take an Observable and return a transformed Observable.

```ts
const myNumbers = Observable.interval(1000).map( (data: number) => data * 2 ).filter( (data: number) => data % 10 !== 0 );
```

## 6. rxjs 6 Syntax

- All operators in rxjs 6 are passed through the pipe() method.

```ts
import { Observable, Observer, Subscription, interval } from 'rxjs';
import { map, filter } from 'rxjs/operators';

const myNumbers = interval(1000).pipe(map( (data: number) => data * 2 )).pipe(filter( (data: number) => data % 10 !== 0 ));
```
