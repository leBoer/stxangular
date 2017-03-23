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
        for (var i = 0; i < exchanges.length; i++) {
            this.exchanges[i].remaining = this.exchangeRemaining(i);
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

    exchangeRemaining(i): any {
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

    testingfunction(): void {
        for (var i = 0; i < this.exchanges.length; i++) {
           console.log(this.exchanges[5].name);
           console.log(this.checkTomorrowWeekend(5));
           console.log(this.weekendRemaining(5, 2));
        }
    }
}