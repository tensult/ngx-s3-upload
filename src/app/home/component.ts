import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, User } from '../auth';
import { URLUtil } from '../../utils';

/**
 * Container for security scans.
 */
@Component({
  moduleId: module.id,
  selector: 'app-home',
  templateUrl: 'component.html',
  styleUrls: ['component.scss']
})
export class HomeComponent implements OnInit {
  signedInUser: User;
  baseUrl: string;

  constructor(private authService: AuthService, private router: Router,
  ) { }

  ngOnInit() {
    this.baseUrl = URLUtil.getBaseUrl();
  }
}
