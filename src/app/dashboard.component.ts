import { Component, OnInit } from '@angular/core';

import { Exchange } from './exchange';
import { ExchangeService } from './exchange.service';

@Component({
  moduleId: module.id,
  selector: 'my-dashboard',
  styleUrls: [ './dashboard.component.css' ],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  exchanges: Exchange[] = [];

  constructor(private exchangeService: ExchangeService) {}

  ngOnInit(): void {
    this.exchangeService.getExchanges()
      .then(exchanges => this.exchanges = exchanges.slice(0,1));
  }
}
