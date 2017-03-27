import { Component, OnInit, Attribute } from '@angular/core';

import { Exchange } from './exchange';
import { ExchangeService } from './exchange.service';
import { ClockService } from './clock.service';
import { MomentModule } from 'angular2-moment';
import * as moment from 'moment-timezone';

@Component({
  moduleId: module.id,
  selector: 'my-dashboard',
  styleUrls: [ './dashboard.component.css' ],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  exchanges: Exchange[] = [];
  myDate: Date;

  constructor(private exchangeService: ExchangeService,
              private clockService: ClockService) {}

  ngOnInit(): void {
    this.exchangeService.getExchanges()
      .then(exchanges => this.exchanges = exchanges);

    this.clockService.utcTime(this.exchanges);
    setInterval(() => {
      this.myDate = this.clockService.utcTime(this.exchanges)[0];
      this.exchanges = this.clockService.utcTime(this.exchanges)[1];
    }, 1000);

    this.clockService.fetchExchanges();
  }

  buttonTest(): any {
    this.clockService.testingfunction();
  }
}
