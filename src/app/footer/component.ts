import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-footer',
    templateUrl: 'component.html',
    styleUrls: ['component.scss']
})
export class FooterComponent implements OnInit {

    year: number;

    ngOnInit() {
        this.year = new Date().getFullYear();
    }
    

}