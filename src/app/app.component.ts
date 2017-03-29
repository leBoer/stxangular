import { Component } from '@angular/core';
import { Observable } from 'rxjs/Rx';

@Component ({
  moduleId: module.id,
  selector: 'stx-clock',
  styleUrls: [ './app.component.css' ],
  template: `
    <div class="container-fluid">
      <div class="row background-row">
        <div class="container">
          <div class="row">
            <div class="col-12 title-div text-left">
              <i class="fa fa-globe fa-2x" aria-hidden="true"></i>
              <h1>    {{ title }}</h1>
            </div>
          </div>
        </div>
      </div>
    </div>
    <app-tabset></app-tabset>
    <router-outlet></router-outlet>
  `
})

export class AppComponent {
  title = 'STXClock';
}
