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
      this.myDate = this.clockService.utcTime(this.exchanges);
    }, 1000);

    // this.nonUTCTime(this.exchanges[1].timezone);
  }

  // nonUTCTime(timezone): any {
  //   var local_time = moment().tz(timezone);
  //   return local_time;
  // }

  // utcTime(): void {
  //   setInterval(() => {
  //     this.myDate = new Date();
  //     var format = 'hh:mm:ss';

  //     for (var i = 0; i < this.exchanges.length; i++) {
  //       var exchange = this.exchanges[i];
  //       exchange.time = this.nonUTCTime(exchange.timezone).format("ddd HH:mm:ss");
  //       exchange.day = this.nonUTCTime(exchange.timezone).format("dddd");
  //       var time = moment(exchange.time, format),
  //         beforeTime = moment(exchange.opening_time, format),
  //         afterTime = moment(exchange.closing_time, format),
  //         beforeDiff = beforeTime.diff(time),
  //         afterDiff = afterTime.diff(time),
  //         beforeDur = moment.duration(beforeDiff),
  //         afterDur = moment.duration(afterDiff),
  //         afterRemaining = Math.floor(afterDur.asHours()) + moment.utc(afterDur.asMilliseconds()).format(":mm:ss"),
  //         beforeRemaining = Math.floor(beforeDur.asHours()) + moment.utc(beforeDur.asMilliseconds()).format(":mm:ss");
  //       // Checks if the exchange is open or closed
  //       if (time.isBetween(beforeTime, afterTime)) {
  //         exchange.open_status = true;
  //         exchange.remaining = afterRemaining;
  //       } else {
  //         exchange.open_status = false;
  //         if (beforeDiff > 0) { // If the exchange is closed, but opens today
  //           exchange.remaining = beforeRemaining;
  //         } else {
  //           // Taking into account for opening times that are tomorrow
  //           beforeTime = beforeTime.add(1, 'd');
  //           beforeDiff = beforeTime.diff(time);
  //           beforeDur = moment.duration(beforeDiff);
  //           beforeRemaining = Math.floor(beforeDur.asHours()) + moment.utc(beforeDur.asMilliseconds()).format(":mm:ss");
  //           exchange.remaining = beforeRemaining;
  //         }
  //       }

  //     }
  //   }, 1000);
  // }

  buttonTest(): void {
    console.log(this.exchanges[4].day);
  }

}
