import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../service';
import { SignupForm } from '../../types';

@Component({
  selector: 'app-password',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})
export class ForgotPasswordComponent {

  username: string;
  submissionError: string;
  submitted = false;
  formErrors: SignupForm = {};

  constructor(private authService: AuthService, private router: Router) { }

  forgotPassword($event) {
    this.submitted = true;
    // Disable default submission.
    $event.preventDefault();
    this.authService.forgotPassword(this.username,
      (err, statusCode) => {
        this.submitted = false;
        if (statusCode === AuthService.statusCodes.verificationCodeRequired) {
          this.router.navigate(['reset-password']);
        } else if (statusCode === AuthService.statusCodes.noSuchUser) {
          this.submissionError = 'Email is not valid.';
        } else if (statusCode === AuthService.statusCodes.unknownError) {
          this.submissionError = err.message;
        }
      });
  }
}
