import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-tabset',
  templateUrl: './tabset.component.html',
  styleUrls: ['./tabset.component.css']
})
export class TabsetComponent implements OnInit {
  location: string;

  constructor(location: Location) {
    this.location = location.path();
  }

  ngOnInit() {
  }
}
