import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DownLoadService } from './service';
import { AuthService, User } from '../auth';
import {S3} from 'aws-sdk'
import { FileSizeUtil, MonthUtil } from '../../utils'
@Component({
  moduleId: module.id,
  selector: 'app-download',
  templateUrl: 'component.html',
  styleUrls: ['component.scss']
})
export class DownloadComponent implements OnInit {
  signedInUser: any;

  rows = [
  ];
  columns = [
    { prop: 'name'},
    { name: 'Size'},
    { name: 'Year'},
    { name: 'Month'},
    { name: 'Day'}
  ];

  constructor(private authService: AuthService,
    private router: Router,
    private downloadService: DownLoadService) {
  }
  
  ngOnInit(): void {
    this.authService.getCurrentUser((err, user: User) => {
      this.signedInUser = user;
      this.downloadService.setSignedInUser(this.signedInUser);
      if (!this.signedInUser || !this.signedInUser.signedIn) {
        this.router.navigate(['signin']);
        // this.authService.redirectToSignin(this.router.routerState.snapshot.root.queryParams);
        return;
      } else {
        this.downloadService.listFiles().then((response) => {
        this.rows = response.Contents.map((data)=>{
           const row : any = {};
           row.url = this.downloadService.getUrl(data.Key);
           row.key = data.Key.split('/').pop();
           row.year = data.LastModified.getUTCFullYear();
           row.month = MonthUtil.getName(data.LastModified.getUTCMonth());
           row.day = data.LastModified.getUTCDate();
           row.size = FileSizeUtil.transform(data.Size);
           return row;
        })
        }).catch((error) => {
        }) ;        
      }
    });
  }


}
