import { Component, DoCheck, OnInit, AfterViewInit } from '@angular/core';

import { LoadingAnimateService } from 'ng2-loading-animate';

import { Exchange } from '../exchange';
import { ExchangeService } from '../exchange.service';
import { ClockService } from '../clock.service';


@Component({
  moduleId: module.id,
  selector: 'app-compact',
  templateUrl: './compact.component.html',
  styleUrls: ['./compact.component.css']
})
export class CompactComponent implements OnInit, AfterViewInit, DoCheck {
  exchanges: Exchange[] =[];

  constructor(private exchangeService: ExchangeService,
              private clockService: ClockService,
              private _loadingSvc: LoadingAnimateService) {
              }

  ngOnInit(): void {

    // this.exchangeService.getExchanges()
    //   .then(exchanges => this.exchanges = exchanges);

    this.clockService.utcTime(this.exchanges);
    setInterval(() => {
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
