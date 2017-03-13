import { Component, OnInit } from '@angular/core';
import { Exchange } from './exchange';
import { ExchangeService } from './exchange.service';
import { Router } from '@angular/router';


@Component({
  moduleId: module.id,
  selector: 'my-exchanges',
  templateUrl: './exchanges.component.html',
  styleUrls: ['./exchanges.component.css']
})
export class ExchangesComponent implements OnInit {
  selectedExchange: Exchange;
  exchanges: Exchange[];

  constructor(
    private router: Router,
    private exchangeService: ExchangeService) {}

  ngOnInit(): void {
    this.getExchanges();
  }

  onSelect(exchange: Exchange): void {
    this.selectedExchange = exchange;
  }

  getExchanges(): void {
    this.exchangeService.getExchanges().then(exchanges => this.exchanges = exchanges);
  }

  gotoDetail(): void {
    this.router.navigate(['/detail', this.selectedExchange.id]);
  }

}
