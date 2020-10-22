import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AngularSplitModule } from 'angular-split';
import { MatButtonModule } from '@angular/material/button';
import { NgScrollbarModule } from 'ngx-scrollbar';

import { AppComponent } from './app.component';
import { SessionPanelListComponent } from './session-panel-list/session-panel-list.component';
import { SessionCardComponent } from './session-panel-list/session-card/session-card.component';
import { SessionDetailComponent } from './session-detail/session-detail.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FeatherModule } from 'angular-feather';
import { MoreVertical, Save } from 'angular-feather/icons';
import { SafePipe } from '../pipes/safe.pipe';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SortByIncognitoPipe } from 'src/pipes/sort-by-incognito.pipe';
import { PromptModalComponent } from './modals/prompt-modal/prompt-modal.component';
import { FormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { MatTooltipModule, MAT_TOOLTIP_DEFAULT_OPTIONS, MatTooltipDefaultOptions } from '@angular/material/tooltip';

const Icons = {
  MoreVertical,
  Save
};

@NgModule({
  declarations: [
    AppComponent,
    SessionPanelListComponent,
    SessionCardComponent,
    SessionDetailComponent,
    SafePipe,
    SortByIncognitoPipe,
    PromptModalComponent
  ],
  imports: [
    BrowserModule,
    NgScrollbarModule,
    AngularSplitModule.forRoot(),
    MatButtonModule,
    FeatherModule.pick(Icons),
    BrowserAnimationsModule,
    FontAwesomeModule,
    FormsModule,
    ModalModule.forRoot(),
    MatTooltipModule
  ],
  providers: [{ provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: { position: 'above' } as MatTooltipDefaultOptions }],
  bootstrap: [AppComponent]
})
export class AppModule { }
