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
        // this.exchangeRemaining(exchanges);
        for (var i = 0; i < exchanges.length; i++) {
            this.exchanges[i].remaining = this.exchangeRemaining2(i);
        }
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
            if (!this.checkTodayWeekend(i) && time.isBetween(beforeTime, afterTime)) {
                exchange.open_status = true;
            } else {
                exchange.open_status = false;
            }
        }
    }

    // exchangeRemaining(exchanges): any {
    //     var format = 'hh:mm:ss';
    //     for (var i = 0; i < exchanges.length; i++) {
    //         var exchange = this.exchanges[i]; // For easier access to individual exchanges
    //         this.exchanges[i].timeobject = moment(exchange.time, format);
    //         this.exchanges[i].beforeTime = moment(exchange.opening_time, format);
    //         this.exchanges[i].afterTime = moment(exchange.closing_time, format);
    //         this.exchanges[i].beforeDiff = this.exchanges[i].beforeTime.diff(this.exchanges[i].timeobject);
    //         this.exchanges[i].afterDiff = this.exchanges[i].afterTime.diff(this.exchanges[i].timeobject);
    //         this.exchanges[i].beforeDur = moment.duration(this.exchanges[i].beforeDiff);
    //         this.exchanges[i].afterDur = moment.duration(this.exchanges[i].afterDiff);
    //         this.exchanges[i].afterRemaining = Math.floor(this.exchanges[i].afterDur.asHours()) + moment.utc(this.exchanges[i].afterDur.asMilliseconds()).format(":mm:ss");
    //         this.exchanges[i].beforeRemaining = Math.floor(this.exchanges[i].afterDur.asHours()) + moment.utc(this.exchanges[i].beforeDur.asMilliseconds()).format(":mm:ss");
    //         if (exchange.open_status == true) {
    //             this.exchanges[i].remaining = this.exchanges[i].afterRemaining;
    //         } else {
    //             if (this.exchanges[i].beforeDiff > 0) {
    //                 this.exchanges[i].remaining = this.exchanges[i].beforeRemaining;
    //             } else {
    //                 this.exchanges[i].beforeTime = this.exchanges[i].beforeTime.add(1, 'd');
    //                 this.exchanges[i].beforeDiff = this.exchanges[i].beforeTime.diff(this.exchanges[i].timeobject);
    //                 this.exchanges[i].beforeDur = moment.duration(this.exchanges[i].beforeDiff);
    //                 this.exchanges[i].beforeRemaining = Math.floor(this.exchanges[i].beforeDur.asHours()) + moment.utc(this.exchanges[i].beforeDur.asMilliseconds()).format(":mm:ss");
    //                 this.exchanges[i].remaining = this.exchanges[i].beforeRemaining;
    //             }
    //         }
    //     }
    // }

    openRemaining(i): any {
        return Math.floor(this.timeValues(i).afterDur.asHours()) + moment.utc(this.timeValues(i).afterDur.asMilliseconds()).format(":mm:ss");

    }    

    morningClosed(i): boolean {
        if (this.exchanges[i].open_status == false && this.timeValues(i).beforeDiff > 0) {
            return true;
        }
    }

    eveningClosed(i): boolean {
        if (this.exchanges[i].open_status == false && this.timeValues(i).beforeDiff < 0) {
            return true;
        }
    }

    morningRemaining(i): any {
        return Math.floor(this.timeValues(i).beforeDur.asHours()) + moment.utc(this.timeValues(i).beforeDur.asMilliseconds()).format(":mm:ss");

    }

    eveningRemaining(i): any {
        var t, beforeTime, beforeDiff, beforeDur;
        t = this.timeValues(i);
        beforeTime = t.beforeTime.add(1, 'd');
        beforeDiff = beforeTime.diff(t.exchangeTime);
        beforeDur = moment.duration(beforeDiff);
        return Math.floor(beforeDur.asHours()) + moment.utc(beforeDur.asMilliseconds()).format(":mm:ss");
    }

    weekendRemaining(i, d): any {
        var t, beforeTime, beforeDiff, beforeDur;
        t = this.timeValues(i);
        beforeTime = t.beforeTime.add(d, 'd');
        beforeDiff = beforeTime.diff(t.exchangeTime);
        beforeDur = moment.duration(beforeDiff);
        return Math.floor(beforeDur.asHours()) + moment.utc(beforeDur.asMilliseconds()).format(":mm:ss");
    }

    timeValues(i): any {
        var format, exchangeTime, afterTime, afterDiff, afterDur, beforeTime, beforeDiff, beforeDur;
        format = 'hh:mm:ss';
        exchangeTime = moment(this.exchanges[i].time, format);
        beforeTime = moment(this.exchanges[i].opening_time, format);
        beforeDiff = beforeTime.diff(exchangeTime);
        beforeDur = moment.duration(beforeDiff);
        afterTime = moment(this.exchanges[i].closing_time, format);
        afterDiff = afterTime.diff(exchangeTime);
        afterDur = moment.duration(afterDiff);
        return {exchangeTime: exchangeTime, afterDur: afterDur, beforeTime, beforeDur, beforeDiff: beforeDiff};
    }

    exchangeRemaining2(i): any {
        if (this.exchanges[i].open_status == true) {
            return this.openRemaining(i);
        } else {
            if (this.morningClosed(i) && !this.checkTodayWeekend(i)) {
                return this.morningRemaining(i);
            } else if (this.eveningClosed(i) && !this.checkTodayWeekend(i) && !this.checkTomorrowWeekend(i)) {
                return this.eveningRemaining(i);
            } else if (this.eveningClosed(i) && !this.checkTodayWeekend(i) && this.checkTomorrowWeekend(i)) {
                return this.weekendRemaining(i, 3);
            } else if (this.checkTodayWeekend(i) && this.checkTomorrowWeekend(i)) {
                return this.weekendRemaining(i, 2);
            } else if (this.checkTodayWeekend(i) && !this.checkTomorrowWeekend(i)) {
                return this.eveningRemaining(i);
            }
        }
    }

    // thoughtFunction(i): any {
    //     if ("it is after closing time" && "it is the day before the first weekend day") {
    //         exchangeRemaining(i, beforeTime = beforeTime.add(2, 'd'));
    //     } else if ("")
    // }

// Changes!
    checkTomorrowWeekend(i): boolean {
        var daysInWeek, todayIndex, tomorrow, exchangeDay

        daysInWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        exchangeDay = this.exchanges[i].day
        function isSameDay(element, index, array) { // Locates the index of today
            return element == exchangeDay; 
        }

        todayIndex = daysInWeek.findIndex(isSameDay);
        tomorrow = daysInWeek[todayIndex + 1];

        if (this.exchanges[i].weekend.includes(tomorrow)) {
            return true;
        }
    }

    checkTodayWeekend(i): boolean {
        if (this.exchanges[i].weekend.includes(this.exchanges[i].day)) {
            return true;
        }
    }

// End of Changes!
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
           console.log(this.exchanges[5].name);
           console.log(this.checkTomorrowWeekend(5));
           console.log(this.weekendRemaining(5, 2));
        }
    }
}