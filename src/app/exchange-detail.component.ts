import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';

import { Exchange } from './exchange';
import { ExchangeService } from './exchange.service';

import 'rxjs/add/operator/switchMap';

@Component({
  moduleId: module.id,
  selector:'exchange-detail',
  styleUrls: [ './exchange-detail.component.css' ],
  templateUrl: './exchange-detail.component.html',
})
export class ExchangeDetailComponent implements OnInit {
  @Input()
  exchange: Exchange;

  constructor(
    private exchangeService: ExchangeService,
    private route: ActivatedRoute,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.route.params
      .switchMap((params: Params) => this.exchangeService.getExchange(+params['id']))
      .subscribe(exchange => this.exchange = exchange);
  }
}
