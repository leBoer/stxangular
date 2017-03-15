import { Injectable } from '@angular/core';

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

    exchangeTimes(exchanges): any {
        for (var i = 0; i < exchanges.length; i++) {
            console.log('exchanges are running');
        }
    }
}