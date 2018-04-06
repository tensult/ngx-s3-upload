import {
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { AuthService } from '../service';
import { Router } from '@angular/router';
import { SignupForm } from '../types';

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
  formErrors: SignupForm = {};
  statusMessage: string;
  statusClass: string;

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
          this.authService.handleRedirect();
          return;
        } else if (statusCode === AuthService.statusCodes.noSuchUser) {
          this.submissionError = 'Email or password is not valid.';
        } else if (statusCode === AuthService.statusCodes.unknownError) {
          this.submissionError = err.message;
        }
      });
  }

  ngOnInit() {
    this.authService.setPreviousAppParams(this.router.routerState.snapshot.root.queryParams);
    this.authService.getCurrentUser((err, currentSignedInUser) => {
      if (currentSignedInUser && currentSignedInUser.signedIn) {
        this.authService.handleRedirect();
      }
    });
  }
}
