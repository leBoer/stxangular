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
        return this.myDate = new Date;
    }

    nonUTCTime(timezone): any {
        var local_time = moment().tz(timezone);
        return local_time;
    }

    exchangeTimes(exchanges): any {
        for (var i = 0; i < exchanges.length; i++) {
            console.log('exchanges are running');
            var exchange = exchanges[i];
            exchange.time = this.nonUTCTime(exchange.timezone).format("ddd HH:mm:ss");
            exchange.day = this.nonUTCTime(exchange.timezone).format("dddd");
        }
    }
}