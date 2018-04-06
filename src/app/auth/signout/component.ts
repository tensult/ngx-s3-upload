import {
  Component,
  OnInit
} from '@angular/core';
import { AuthService } from '../service';
import { Router } from '@angular/router';

@Component({
  template: ``
})
export class SignoutComponent implements OnInit {

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.authService.signout();
  }
} 
