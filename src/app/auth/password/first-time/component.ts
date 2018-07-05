import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../service';
import { SignupForm } from '../../types';

@Component({
  selector: 'app-password',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})
export class FirstTimePasswordComponent {
  newPassword: string;
  confirmPassword: string;
  submissionError: string;
  submitted = false;
  statusMessage: string;
  statusClass: string;
  formErrors: SignupForm = {};

  constructor(private authService: AuthService, private router: Router) { }

  private validateNewPassword() {
    let isValid = true;
    if (this.confirmPassword !== this.newPassword) {
      isValid = false;
      this.formErrors.confirmPassword = 'Confirm password should match new password.';
    }

    return isValid;
  }

  updatePassword(event) {
    // Disable default submission.
    event.preventDefault();
    if (!this.validateNewPassword()) {
      return;
    }
    this.submitted = true;
    this.formErrors = {};
    this.authService.authenticate({
      newPassword: this.newPassword
    },
      (err, statusCode) => {
        this.submitted = false;
        if (statusCode === AuthService.statusCodes.signedIn) {
          this.statusMessage = 'Password change is successful. You will be redirected to signin page within 5 seconds';
          this.statusClass = 'alert-success';
          setTimeout(() => { this.authService.signout(); }, 4000);
          return;
        } else if (statusCode === AuthService.statusCodes.incompletedSigninData) {
          this.router.navigate(['']);
          return;
        } else if (statusCode === AuthService.statusCodes.unknownError) {
          this.submissionError = err.message;
        }
      });
  }
}
