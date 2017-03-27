import { Component, OnInit } from '@angular/core';

import { Exchange } from '../exchange';
import { ExchangeService } from '../exchange.service';
import { ClockService } from '../clock.service';


@Component({
  moduleId: module.id,
  selector: 'app-compact',
  templateUrl: './compact.component.html',
  styleUrls: ['./compact.component.css']
})
export class CompactComponent implements OnInit {
  exchanges: Exchange[] =[];

  constructor(private exchangeService: ExchangeService,
              private clockService: ClockService) { }

  ngOnInit(): void {
    this.exchangeService.getExchanges()
      .then(exchanges => this.exchanges = exchanges);

    this.clockService.utcTime(this.exchanges);
    setInterval(() => {
      this.exchanges = this.clockService.utcTime(this.exchanges)[1];
    }, 1000);

    this.clockService.fetchExchanges();
  }

}
