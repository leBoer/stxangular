import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './dashboard.component';
import { CompactComponent } from './compact/compact.component';
import { ExchangeDetailComponent } from './exchange-detail.component';
import { ExchangesComponent } from './exchanges.component';
import { ContactComponent } from './contact/contact.component';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'detail/:id', component: ExchangeDetailComponent },
  { path: 'exchanges', component: ExchangesComponent },
  { path: 'compact', component: CompactComponent },
  { path: 'contact', component: ContactComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})

export class AppRoutingModule { }
