import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { UsersService } from './users.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  user1Activated = false;
  user2Activated = false;
  userActivationSubscription: Subscription;

  constructor(private usersService: UsersService) {}

  ngOnInit() {
    this.userActivationSubscription = this.usersService.userActivated.subscribe( (id: number) => {
      switch (id) {
        case 1 : this.user1Activated = true;
        break;
        case 2 : this.user2Activated = true;
        break;
      }
    } );
  }

  ngOnDestroy() {
    this.userActivationSubscription.unsubscribe();
  }
}
