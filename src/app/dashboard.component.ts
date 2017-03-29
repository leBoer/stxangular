import { Component, DoCheck, OnInit, AfterViewInit, Attribute } from '@angular/core';

import { LoadingAnimateService } from 'ng2-loading-animate';

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
export class DashboardComponent implements OnInit, AfterViewInit, DoCheck {
  exchanges: Exchange[] = [];
  myDate: Date;

  constructor(private exchangeService: ExchangeService,
              private clockService: ClockService,
              private _loadingSvc: LoadingAnimateService) {}

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

  ngAfterViewInit(): void {
    this.startAnimate();
  }

  ngDoCheck() {
    if (this.exchanges.length > 0 && "open_status" in this.exchanges[0]) {
      this._loadingSvc.setValue(false);
    }
 }

  startAnimate(): void {
    this._loadingSvc.setValue(true);
    let that: any = this;
    setTimeout(function(): void {
      that._loadingSvc.setValue(false);
    }, 3000);
  }

  buttonTest(): any {
    this.clockService.testingfunction();
  }
}
