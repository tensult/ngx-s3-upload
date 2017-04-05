import {
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { AuthService } from '../service';
import { Router } from '@angular/router';
import {SigninForm} from '../types';

@Component({
  selector: 'app-signin',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})
export class SigninComponent implements OnInit {

  username: string;
  password: string;
  submissionError: string;
  submitted = false;
  formErrors: SigninForm = {};

  constructor(private authService: AuthService, private router: Router) { }

  signin($event) {
    this.submitted = true;
    // Disable default submission.
    $event.preventDefault();

    this.authService.authenticate({
      username: this.username,
      password: this.password
    },
      (err, statusCode) => {
        this.submitted = false;
        if (statusCode === AuthService.statusCodes.newPasswordRequired) {
          this.router.navigate(['first-time-password']);
        } else if (statusCode === AuthService.statusCodes.signedIn) {
          this.router.navigate(['']);
          return;
        } else if (statusCode === AuthService.statusCodes.noSuchUser) {
          this.submissionError = 'Email or password is not valid.';
        } else if (statusCode === AuthService.statusCodes.unknownError) {
          this.submissionError = err.message;
        }
      });
  }

  ngOnInit() {
    console.log('Inside SigninComponent');
    const currentSignedInUser = this.authService.getCurrentUser();
    console.log('Inside SigninComponent', currentSignedInUser);
    if (currentSignedInUser && currentSignedInUser.signedIn) {
      this.router.navigate(['']);
    }
  }
}
