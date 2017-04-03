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
        // this.checkHoliday(1);
     
        return [this.myDate = new Date, this.exchanges];
    }
    // May be deleted afterwards...
    buildHolidayArray(i): any {
        this.exchanges[i].upcomingHolidays = [];
        for (var e = 0; e < this.exchanges[i].holidays.length; e++) {
            var holiday = moment(this.exchanges[i].holidays[e], "MMMM DD, YYYY");
            this.exchanges[i].upcomingHolidays.push(moment().diff(holiday, 'days'));
        }
    }

    checkHoliday(i, d): any {
        if(this.exchanges[i].upcomingHolidays.includes(d)) {
            return true;
        }
    }

    nonUTCTime(timezone): any {
        var local_time = moment().tz(timezone);
        return local_time;
    }

    exchangeTimes(exchanges): any {
        for (var i = 0; i < exchanges.length; i++) {
            this.buildHolidayArray(i);
            this.buildHolidayArray2(i);
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
            if (!this.checkTodayWeekend(i) && time.isBetween(beforeTime, afterTime) && !this.checkHoliday(i, 0)) {
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
            if (this.morningClosed(i) && !this.checkTodayWeekend(i) && (this.exchanges[i].upcomingHolidays2[0] > 24) || this.exchanges[i].upcomingHolidays2.length == 0) { // if it's morning, and today is trading day
                return this.morningRemaining(i);
            } else if (this.eveningClosed(i) && !this.checkTodayWeekend(i) && !this.checkTomorrowWeekend(i)) { // if it's evening, and tomorrow is not a weekend
                if (this.exchanges[i].upcomingHolidays2[0] < 24) { // today is a holiday
                    if (this.exchanges[i].upcomingHolidays2[1] < 48){ // tomorrow is a holiday
                        if (this.exchanges[i].upcomingHolidays2[2] < 72) { // holiday in 2 days
                            if (this.exchanges[i].upcomingHolidays2[3] < 96) { // holiday in 3 days
                                console.log('Scenario 0');
                                return this.weekendRemaining(i, 5);
                            } else {
                                console.log('Scenario 1')
                                return this.weekendRemaining(i, 4);
                            }
                        } else {
                            console.log('Scenario 2');
                            return this.weekendRemaining(i, 3);
                        }
                    } else {
                        console.log(this.exchanges[i].name);
                        console.log('Scenario 3');
                        return this.weekendRemaining(i, 2);
                    }
                } else {
                    console.log(this.exchanges[i].name);
                    console.log('Scenario 4');
                    return this.eveningRemaining(i);
                }
                //////////////////////////////////
            } else if (this.eveningClosed(i) && !this.checkTodayWeekend(i) && this.checkTomorrowWeekend(i)) { // if it's the evening before weekend
                if (this.exchanges[i].upcomingHolidays2[0] > 48) {
                    if (this.exchanges[i].upcomingHolidays2[1] > 72) {
                        if (this.exchanges[i].upcomingHolidays2[2] > 96) {
                            if (this.exchanges[i].upcomingHolidays2[3] > 120) {
                                console.log('Scenario 5');
                                return this.weekendRemaining(i, 7);
                            } else {
                                console.log('Scenario 6');
                                return this.weekendRemaining(i, 6);
                            }
                        } else {
                            console.log('Scenario 6');
                            return this.weekendRemaining(i, 5);
                        }
                    } else {
                        console.log('Scenario 7');
                        return this.weekendRemaining(i, 4);
                    }
                } else {
                    console.log(this.exchanges[i].name);
                    console.log('Scenario 8');
                    return this.weekendRemaining(i, 3);
                } 
                ////////////////////////////////////////////////
            } else if (this.checkTodayWeekend(i) && this.checkTomorrowWeekend(i) && !this.checkHoliday(i, -2)) { // if it's a weekend today, and a weekend tomorrow, and not a holiday the day after
                if (this.exchanges[i].upcomingHolidays2[0] > 24) {
                    if (this.exchanges[i].upcomingHolidays2[1] > 48) {
                        if (this.exchanges[i].upcomingHolidays2[2] > 72) {
                            if (this.exchanges[i].upcomingHolidays2[3] > 96) {
                                console.log('Scenario 13');
                                return this.weekendRemaining(i, 6);
                            } else {
                                console.log('Scenario 12');
                                return this.weekendRemaining(i, 5);
                            }
                        } else {
                            console.log('Scenario 11');
                            return this.weekendRemaining(i, 4);
                        }
                    } else {
                        console.log('Scenario 10');
                        return this.weekendRemaining(i, 3);
                    }
                } else {
                    console.log('Scenario 9');
                    return this.weekendRemaining(i, 2);
                }
                //////////////////////////////////////////////////
            } else if (this.checkTodayWeekend(i) && !this.checkTomorrowWeekend(i) && !this.checkHoliday(i, -1)) { // if it's a weekend today, and open tomorrow
                return this.eveningRemaining(i);
            } else if (this.exchanges[i].upcomingHolidays2[0] < 0) { // today is holiday
                if (this.exchanges[i].upcomingHolidays2[1] < 24) { // tomorrow is holiday
                    if (this.exchanges[i].upcomingHolidays2[2] < 48) { // holiday in two days
                        if (this.exchanges[i].upcomingHolidays2[3] < 72) { // holiday in three days
                            if (this.exchanges[i].upcomingHolidays2[4] < 96) { // holiday in four days

                            } else {
                                console.log('Scenario 17 (must be a monday)');
                                return this.weekendRemaining(i, 6);
                            }
                        } else {
                            console.log('Scenario 16');
                            return this.weekendRemaining(i, 3)
                        }
                    } else {
                        // console.log('Scenario 15');
                        return this.weekendRemaining(i, 2);
                    }
                } else {
                    // console.log('Scenario 14');
                    return this.eveningRemaining(i);
                }
            } else {
                console.log(this.exchanges[i].name);
                console.log('Now this is a scenario that we dont have an answer for');
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
    
    buildHolidayArray2(i): any {
        this.exchanges[i].upcomingHolidays2 = [];
        for (var e = 0; e < this.exchanges[i].holidays.length; e++) {
            var holiday = moment(this.exchanges[i].holidays[e], "MMMM DD, YYYY");
            var k = -moment().diff(holiday, 'hours');
            if (k >= -24) {
                this.exchanges[i].upcomingHolidays2.push(k);
            }
        }
    }

    testingfunction(): void {
        // for (var i = 0; i < this.exchanges.length; i++) {
        //     this.buildHolidayArray2(i);
        // }
        console.log(this.exchanges);
        console.log(this.exchanges[0].name);
        console.log(this.morningClosed(0));
        // console.log(this.exchanges[5].upcomingHolidays2);
    }
}