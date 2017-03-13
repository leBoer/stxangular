import { Component, OnInit, Attribute } from '@angular/core';

import { Exchange } from './exchange';
import { ExchangeService } from './exchange.service';

@Component({
  moduleId: module.id,
  selector: 'my-dashboard',
  styleUrls: [ './dashboard.component.css' ],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  exchanges: Exchange[] = [];
  myDate: Date;

  constructor(private exchangeService: ExchangeService) {}

  ngOnInit(): void {
    this.exchangeService.getExchanges()
      .then(exchanges => this.exchanges = exchanges);

    this.utcTime();
  }

  utcTime(): void {
    setInterval(() => {
      this.myDate = new Date();
    }, 1000);
  }
}
