import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, User } from '../auth';
import { Dictionary } from '../../types';

@Component({
  selector: 'app-terms',
  templateUrl: './terms.component.html',
  styleUrls: ['./terms.component.scss']
})
export class TermsComponent implements OnInit {

  termsAcceptedOn: string;
  submissionStatus: string;
  submissionStatusClass: string;
  loading = false;
  showButtons = false;
  private static termsAcceptTimeKey = 'custom:terms_accepted_on';

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
    if (this.authService.currentStatus === AuthService.statusCodes.newPasswordRequired) {
        this.showButtons = true;
        return;
    }
    this.authService.getCurrentUser((err, currentSignedInUser) => {
       if (currentSignedInUser && currentSignedInUser.signedIn) {
        this.loading = true;
        this.authService.getUserAttributes((err, userAttributes) => {
          this.loading = false;
          if (err || !userAttributes) {
            // console.error(err, new Error('Unable to retrive user attributes.'));
            return;
          }
          if (!userAttributes[TermsComponent.termsAcceptTimeKey]) {
            this.showButtons = true;
          } else {
            this.termsAcceptedOn = userAttributes[TermsComponent.termsAcceptTimeKey];
          }
        });
      }
    });
  }

  agree() {
    if (this.authService.currentStatus === AuthService.statusCodes.newPasswordRequired) {
      this.authService.addAdditionalSignupData(TermsComponent.termsAcceptTimeKey, new Date().toUTCString());
      this.router.navigate(['first-time-password']);
    } else {
      const termsAcceptedOn = new Date().toUTCString();
      this.loading = true;
      this.authService.setUserAttribute(TermsComponent.termsAcceptTimeKey, termsAcceptedOn, (err) => {
        this.loading = false;
        if (err) {
          this.submissionStatus = "Request failed. Please try again later";
          this.submissionStatusClass = "alert-danger";
        } else {
          this.submissionStatus = "Thank you for accepting our terms. You will be redirected to our services page shortly.";
          this.submissionStatusClass = "alert-success";
          setTimeout(() => { this.router.navigate(['home']); }, 4000);
        }
      });
    }
  }

  disagree() {
    this.router.navigate(['']);
  }
}
