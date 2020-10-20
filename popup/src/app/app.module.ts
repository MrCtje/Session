import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AngularSplitModule } from 'angular-split';

import { AppComponent } from './app.component';
import { SessionPanelListComponent } from './session-panel-list/session-panel-list.component';
import { SessionCardComponent } from './session-panel-list/session-card/session-card.component';
import { SessionDetailComponent } from './session-detail/session-detail.component';

@NgModule({
  declarations: [
    AppComponent,
    SessionPanelListComponent,
    SessionCardComponent,
    SessionDetailComponent
  ],
  imports: [
    BrowserModule,
    AngularSplitModule.forRoot(),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
