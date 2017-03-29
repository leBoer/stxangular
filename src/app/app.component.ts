import { Component } from '@angular/core';
import { Observable } from 'rxjs/Rx';

@Component ({
  moduleId: module.id,
  selector: 'stx-clock',
  styleUrls: [ './app.component.css' ],
  template: `
    <div class="row">
      <div class="col-12 title-div text-left">
        <i class="fa fa-globe fa-2x" aria-hidden="true"></i>
        <h1>    {{ title }}</h1>
      </div>
    </div>
    <app-tabset></app-tabset>
    <router-outlet></router-outlet>
  `
    // <h1>{{title}}</h1>
    // <nav>
    //   <a routerLink="/dashboard" routerLinkActive="active">Dashboard</a>
    //   <a routerLink="/exchanges" routerLinkActive="active">Exchanges</a>
    // </nav>
    // <router-outlet></router-outlet>
})

export class AppComponent {
  title = 'STXClock';
}
