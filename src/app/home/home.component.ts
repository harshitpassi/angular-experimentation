import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Observer, Subscription, interval } from 'rxjs';
import { map, filter } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  mySubscription: Subscription;
  numberSubscription: Subscription;

  constructor() { }

  ngOnInit() {
    const myNumbers = interval(1000).pipe(map( (data: number) => data * 2 )).pipe(filter( (data: number) => data % 10 !== 0 ));
    this.numberSubscription = myNumbers.subscribe((num: number) => console.log(num));

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
    this.numberSubscription.unsubscribe();
  }

}
