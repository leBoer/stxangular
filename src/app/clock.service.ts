import { Injectable } from '@angular/core';
import { MomentModule } from 'angular2-moment';
import * as moment from 'moment-timezone';

import { Exchange } from './exchange';
import { ExchangeService } from './exchange.service';

@Injectable()
export class ClockService {
    myDate: Date;
    exchanges: Exchange[] =[];

    constructor(private exchangeService: ExchangeService) { }

    fetchExchanges(): void {
        this.exchangeService.getExchanges()
            .then(exchanges => this.exchanges = exchanges);
    }

    utcTime(exchanges): any {
        this.exchangeTimes(exchanges);
        this.exchangeOpenStatus(exchanges);
        this.exchangeRemaining(exchanges);
        return [this.myDate = new Date, this.exchanges];
    }

    nonUTCTime(timezone): any {
        var local_time = moment().tz(timezone);
        return local_time;
    }

    exchangeTimes(exchanges): any {
        for (var i = 0; i < exchanges.length; i++) {
            var exchange = exchanges[i]; // Sets a variable for easier access to individual exchanges
            exchange.time = this.nonUTCTime(exchange.timezone).format("ddd HH:mm:ss");
            exchange.day = this.nonUTCTime(exchange.timezone).format("dddd");
        }
    }

    exchangeOpenStatus(exchanges): any {
        var format = 'hh:mm:ss';
        for (var i = 0; i < exchanges.length; i++) {
            var exchange = exchanges[i]; // Sets a variable for easier access to individual exchanges
            var time = moment(exchange.time, format),
                beforeTime = moment(exchange.opening_time, format),
                afterTime = moment(exchange.closing_time, format);
            if (!this.checkWeekend(i) && time.isBetween(beforeTime, afterTime)) {
                exchange.open_status = true;
            } else {
                exchange.open_status = false;
            }
        }
    }

    exchangeRemaining(exchanges): any {
        var format = 'hh:mm:ss';
        for (var i = 0; i < exchanges.length; i++) {
            var exchange = exchanges[i]; // For easier access to individual exchanges
            var time = moment(exchange.time, format),
                beforeTime = moment(exchange.opening_time, format),
                afterTime = moment(exchange.closing_time, format),
                beforeDiff = beforeTime.diff(time),
                afterDiff = afterTime.diff(time),
                beforeDur = moment.duration(beforeDiff),
                afterDur = moment.duration(afterDiff),
                afterRemaining = Math.floor(afterDur.asHours()) + moment.utc(afterDur.asMilliseconds()).format(":mm:ss"),
                beforeRemaining = Math.floor(afterDur.asHours()) + moment.utc(beforeDur.asMilliseconds()).format(":mm:ss");
            if (exchange.open_status == true) {
                this.exchanges[i].remaining = afterRemaining;
            } else {
                if (beforeDiff > 0) {
                    this.exchanges[i].remaining = beforeRemaining;
                } else {
                    beforeTime = beforeTime.add(1, 'd');
                    beforeDiff = beforeTime.diff(time);
                    beforeDur = moment.duration(beforeDiff);
                    beforeRemaining = Math.floor(beforeDur.asHours()) + moment.utc(beforeDur.asMilliseconds()).format(":mm:ss");
                    this.exchanges[i].remaining = beforeRemaining;
                }
            }
        }
    }

    // thoughtFunction(i): any {
    //     if ("it is after closing time" && "it is the day before the first weekend day") {
    //         exchangeRemaining(i, beforeTime = beforeTime.add(2, 'd'));
    //     } else if ("")
    // }



    checkWeekend(i): any {
        if (this.exchanges[i].weekend[0] == this.exchanges[i].day) {
            this.exchanges[i].extra_days = 2;
            return true;
        } else if (this.exchanges[i].weekend[1] == this.exchanges[i].day) {
            this.exchanges[i].extra_days = 1;
            return true;
        } else {
            this.exchanges[i].extra_days = 0;
        }
    }

    testingfunction(): void {
        for (var i = 0; i < this.exchanges.length; i++) {
           console.log(this.exchanges);
           console.log(this.exchanges[i].extra_days);

        }
    }
}