import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MomentModule } from 'angular2-moment';
import { AlertModule } from 'ng2-bootstrap';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard.component';
import { ExchangeDetailComponent } from './exchange-detail.component';
import { ExchangesComponent } from './exchanges.component';
import { ExchangeService } from './exchange.service';
import { ClockService } from './clock.service';

import { AppRoutingModule } from './app-routing.module';
import { TabsetComponent } from './tabset/tabset.component';
import { CompactComponent } from './compact/compact.component';
// import { NavbarComponent } from './navbar/navbar.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    ExchangeDetailComponent,
    ExchangesComponent,
    TabsetComponent,
    CompactComponent
    // NavbarComponent
  ],
  imports: [
    AlertModule.forRoot(),
    BrowserModule,
    FormsModule,
    HttpModule,
    NgbModule.forRoot(),
    AppRoutingModule,
    MomentModule
  ],
  providers: [ExchangeService, ClockService],
  bootstrap: [AppComponent]
})

export class AppModule { }
