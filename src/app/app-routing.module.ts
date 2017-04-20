import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './dashboard.component';
import { ContactComponent } from './contact/contact.component';

const routes: Routes = [
  // { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: '', component: DashboardComponent },
  { path: 'contact', component: ContactComponent },
  // { path: 'detail/:id', component: ExchangeDetailComponent },
  // { path: 'exchanges', component: ExchangesComponent },
  // { path: 'compact', component: CompactComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})

export class AppRoutingModule { }
