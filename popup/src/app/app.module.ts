import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AngularSplitModule } from 'angular-split';
import { MatButtonModule } from '@angular/material/button';
import { NgScrollbarModule } from 'ngx-scrollbar';
import {MatMenuModule} from '@angular/material/menu';
import {MatDividerModule} from '@angular/material/divider';
import { MatTooltipModule, MAT_TOOLTIP_DEFAULT_OPTIONS, MatTooltipDefaultOptions } from '@angular/material/tooltip';


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
import { SessionSearchComponent } from './session-panel-list/session-search/session-search.component';
import { FilterBackupSessionsPipe } from 'src/pipes/filter-backup-session';
import { FilterSavedSessionsPipe } from 'src/pipes/filter-saved-session';
import { FilterCurrentSessionPipe } from 'src/pipes/filter-current-session';
import { RequestFocusDirective } from 'src/directives/request-focus.directive';
import { SettingsMenuComponent } from './settings-menu/settings-menu.component';


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
    PromptModalComponent,
    SessionSearchComponent,
    FilterBackupSessionsPipe,
    FilterSavedSessionsPipe,
    FilterCurrentSessionPipe,
    RequestFocusDirective,
    SettingsMenuComponent
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
    MatTooltipModule,
    MatMenuModule,
    MatDividerModule
  ],
  providers: [{ provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: { position: 'above' } as MatTooltipDefaultOptions }],
  bootstrap: [AppComponent]
})
export class AppModule { }
