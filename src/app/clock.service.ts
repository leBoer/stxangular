import { Injectable } from '@angular/core';
import { MomentModule } from 'angular2-moment';
import * as moment from 'moment-timezone';

import { Exchange } from './exchange';

@Injectable()
export class ClockService {
    myDate: Date;
    exchanges: Exchange[] =[];

    constructor() { }

    utcTime(exchanges): any {
        this.exchangeTimes(exchanges);
        this.exchangeOpenStatus(exchanges);
        return this.myDate = new Date;
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
            if (time.isBetween(beforeTime, afterTime)) {
                exchange.open_status = true;
            } else {
                exchange.open_status = false;
            }
                    
        }
    }
}