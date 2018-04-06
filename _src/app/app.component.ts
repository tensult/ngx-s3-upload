import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/service';
import { User } from './auth';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  user: User;
  title = 'Tensult';
  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.authService.signinEvent$.subscribe(user => this.onUserSignin(user));
    this.onUserSignin(this.authService.getCurrentUser());
  }

  private onUserSignin(user: User): void {
    this.user = user;
  }
}
