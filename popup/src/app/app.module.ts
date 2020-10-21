import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AngularSplitModule } from 'angular-split';
import { MatButtonModule } from '@angular/material/button';

import { AppComponent } from './app.component';
import { SessionPanelListComponent } from './session-panel-list/session-panel-list.component';
import { SessionCardComponent } from './session-panel-list/session-card/session-card.component';
import { SessionDetailComponent } from './session-detail/session-detail.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FeatherModule } from 'angular-feather';
import { MoreVertical, Save } from 'angular-feather/icons';

const Icons = {
  MoreVertical,
  Save
};

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
    MatButtonModule,
    FeatherModule.pick(Icons),
    BrowserAnimationsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
