import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../service';
import { SignupForm } from '../../types';

@Component({
  selector: 'app-password',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})
export class ResetPasswordComponent {

  verificationCode: string;
  newPassword: string;
  confirmPassword: string;
  submissionError: string;
  submitted = false;
  formErrors: SignupForm = {};
  statusMessage: string;
  statusClass: string;
  isSuccessful = false;

  constructor(private authService: AuthService, private router: Router) { }

  private validateNewPassword() {
    let isValid = true;
    if (this.confirmPassword !== this.newPassword) {
      isValid = false;
      this.formErrors.confirmPassword = 'Confirm password should match new password.';
    }

    return isValid;
  }

  resetPassword($event) {
    if (!this.validateNewPassword()) {
      return;
    }
    this.submitted = true;
    // Disable default submission.
    $event.preventDefault();
    this.authService.confirmPassword(this.verificationCode, this.newPassword,
      (err, statusCode) => {
        this.submitted = false;
        if (statusCode === AuthService.statusCodes.incompletedSigninData) {
          this.router.navigate(['forot-password']);
        } else if (statusCode === AuthService.statusCodes.success) {
          this.statusMessage = 'Password change is successful. You will be redirected to signin page within 5 seconds';
          this.statusClass = 'alert-success';
          setTimeout(() => { this.authService.signout(); }, 4000);
          return;
        } else if (statusCode === AuthService.statusCodes.unknownError) {
          this.submissionError = err.message;
        }
      });
  }
}
