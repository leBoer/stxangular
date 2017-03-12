import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard.component';
import { ExchangeDetailComponent } from './exchange-detail.component';
import { ExchangesComponent } from './exchanges.component';
import { ExchangeService } from './exchange.service';

import { AppRoutingModule } from './app-routing.module';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    ExchangesComponent,
    ExchangeDetailComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule
  ],
  providers: [ExchangeService],
  bootstrap: [AppComponent]
})

export class AppModule { }
