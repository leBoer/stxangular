import { Component, OnInit, Attribute } from '@angular/core';

import { Exchange } from './exchange';
import { ExchangeService } from './exchange.service';
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

  constructor(private exchangeService: ExchangeService) {}

  ngOnInit(): void {
    this.exchangeService.getExchanges()
      .then(exchanges => this.exchanges = exchanges);

    this.utcTime();
    // this.nonUTCTime(this.exchanges[1].timezone);
  }

  nonUTCTime(timezone): any {
    var local_time = moment().tz(timezone);
    return local_time;
  }

  utcTime(): void {
    setInterval(() => {
      this.myDate = new Date();
      var format = 'hh:mm:ss';
      // console.log(this.exchanges[1].timezone); // for testing purposes
      // this.nonUTCTime(this.exchanges[1].timezone);
      for (var i = 0; i < this.exchanges.length; i++) {
        this.exchanges[i].time = this.nonUTCTime(this.exchanges[i].timezone).format("ddd HH:mm:ss");
        this.exchanges[i].day = this.nonUTCTime(this.exchanges[i].timezone).format("dddd");
        var time = moment(this.exchanges[i].time, format),
          beforeTime = moment(this.exchanges[i].opening_time, format),
          afterTime = moment(this.exchanges[i].closing_time, format);
        if (time.isBetween(beforeTime, afterTime)) {
          this.exchanges[i].open_status = true;
        } else {
          this.exchanges[i].open_status = false;
        }
        // if (this.exchanges[i].closing_time > this.nonUTCTime(this.exchanges[i].timezone) > this.exchanges[i].opening_time) {
        //   console.log('Open!!');
        // } else {
        //   console.log('Closed!!');
        // }
      }
    }, 1000);
  }

}
