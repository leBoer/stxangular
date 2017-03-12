import { Component } from '@angular/core';

@Component ({
  moduleId: module.id,
  selector: 'stx-clock',
  styleUrls: [ './app.component.css' ],
  template: `
    <h1>{{title}}</h1>
    <nav>
      <a routerLink="/dashboard" routerLinkActive="active">Dashboard</a>
      <a routerLink="/exchanges" routerLinkActive="active">Exchanges</a>
    </nav>
    <router-outlet></router-outlet>
  `
})

export class AppComponent {
  title = 'Stock Exchange Clock';
}
