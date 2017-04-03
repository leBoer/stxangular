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
        for (var i = 0; i < exchanges.length; i++) {
            this.weekBuilder(i);
            this.exchangeOpenStatus(i);
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

    exchangeOpenStatus(i): any {
        var format = 'hh:mm:ss';
        var exchange = this.exchanges[i]; // Sets a variable for easier access to individual exchanges
        var time = moment(exchange.time, format),
            beforeTime = moment(exchange.opening_time, format),
            afterTime = moment(exchange.closing_time, format);
        if ((this.exchanges[i].week[0] || this.exchanges[i].week.length == 0) && time.isBetween(beforeTime, afterTime)) {
            exchange.open_status = true;
        } else {
            exchange.open_status = false;
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
        var w = this.exchanges[i].week; // For easier access
        if (this.exchanges[i].open_status == true) {
            return this.openRemaining(i);
        } else {
            if (this.morningClosed(i) && w.length == 0) {
                // console.log(this.exchanges[i].name);
                return this.morningRemaining(i);
            } else if (this.eveningClosed(i) && this.exchanges[i].week[0] && this.exchanges[i].week[1] && this.exchanges[i].week.length == 2) {
                // console.log(this.exchanges[i].name);
                return this.eveningRemaining(i);
            } else if (this.eveningClosed(i) && this.exchanges[i].week[0] && !this.exchanges[i].week[1]) {
                // console.log(this.exchanges[i].name);
                return this.weekendRemaining(i, this.exchanges[i].week.length);
            } else if (!this.exchanges[i].week[0] && !this.exchanges[i].week[1]) {
                // console.log(this.exchanges[i].name);
                return this.weekendRemaining(i, this.exchanges[i].week.length);
            } else if (!this.exchanges[i].week[0] && this.exchanges[i].week.length == 1) {
                // console.log(this.exchanges[i].name);
                return this.eveningRemaining(i);
            }
        }
    }

    // checkTomorrowWeekend(i): boolean {
    //     var daysInWeek, todayIndex, tomorrow, exchangeDay

    //     daysInWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    //     exchangeDay = this.exchanges[i].day
    //     function isSameDay(element, index, array) { // Locates the index of today
    //         return element == exchangeDay; 
    //     }

    //     todayIndex = daysInWeek.findIndex(isSameDay);
    //     tomorrow = daysInWeek[todayIndex + 1];

    //     if (this.exchanges[i].weekend.includes(tomorrow)) {
    //         return true;
    //     }
    // }

    // checkTodayWeekend(i): boolean {
    //     if (this.exchanges[i].weekend.includes(this.exchanges[i].day)) {
    //         return true;
    //     }
    // }

    // Checks if a given day is a holiday h = 0 means today, h = 1 means tomorrow
    checkHoliday(i, h): boolean {
        var currentTimeObject = this.nonUTCTime(this.exchanges[i].timezone).add(h, 'day');
        var formattedCurrentTime = currentTimeObject.format('MMMM DD, YYYY');
        var holidayMoment = moment(this.exchanges[i].holidays[h], 'MMMM DD, YYYY');
        var formattedHoliday = holidayMoment.format('MMMM DD, YYYY');
        if (formattedCurrentTime == formattedHoliday ||
            this.exchanges[i].holidays.includes(formattedCurrentTime) ||
            this.exchanges[i].weekend.includes(currentTimeObject.format('dddd'))) {
            return true;
        } else {
            return false;
        }
    }

    // Builds an array for the upcoming non-trading days
    // False = Closed, True = Open
    weekBuilder(i): void {
        this.exchanges[i].week = [];
        for (var h = 0; h < this.exchanges[i].holidays.length + 14; h++) {
            if (this.checkHoliday(i, h)) {
                this.exchanges[i].week.push(false);
            } else {
                return;
            }
        }
    }

    testingfunction(): any {
        // this.weekBuilder(0);
        console.log(this.exchanges[0].week);
        console.log(this.exchanges);
    }
}