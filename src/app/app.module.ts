import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MomentModule } from 'angular2-moment';
import { AlertModule } from 'ng2-bootstrap';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LoadingAnimateModule, LoadingAnimateService } from 'ng2-loading-animate';


import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard.component';
import { ExchangeDetailComponent } from './exchange-detail.component';
import { ExchangesComponent } from './exchanges.component';
import { ExchangeService } from './exchange.service';
import { ClockService } from './clock.service';

import { AppRoutingModule } from './app-routing.module';
import { TabsetComponent } from './tabset/tabset.component';
import { CompactComponent } from './compact/compact.component';
import { SortPipe } from './sort.pipe';
// import { NavbarComponent } from './navbar/navbar.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    ExchangeDetailComponent,
    ExchangesComponent,
    TabsetComponent,
    CompactComponent,
    SortPipe
    // NavbarComponent
  ],
  imports: [
    AlertModule.forRoot(),
    BrowserModule,
    FormsModule,
    HttpModule,
    LoadingAnimateModule.forRoot(),
    NgbModule.forRoot(),
    AppRoutingModule,
    MomentModule
  ],
  providers: [ExchangeService, ClockService, LoadingAnimateService],
  bootstrap: [AppComponent]
})

export class AppModule { }
