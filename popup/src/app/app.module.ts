import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipDefaultOptions, MatTooltipModule, MAT_TOOLTIP_DEFAULT_OPTIONS } from '@angular/material/tooltip';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FeatherModule } from 'angular-feather';
import { MoreVertical, Save } from 'angular-feather/icons';
import { AngularSplitModule } from 'angular-split';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NgScrollbarModule } from 'ngx-scrollbar';

import { RequestFocusDirective } from 'src/directives/request-focus.directive';
import { ScrollToIfActiveDirective } from 'src/directives/scroll-to-if-active.directive';

import { FilterBackupSessionsPipe } from 'src/pipes/filter-backup-session';
import { FilterCurrentSessionPipe } from 'src/pipes/filter-current-session';
import { FilterSavedSessionsPipe } from 'src/pipes/filter-saved-session';
import { SortByIncognitoPipe } from 'src/pipes/sort-by-incognito.pipe';
import { SortTabByPipe } from 'src/pipes/sort-tab-by.pipe copy';
import { SafePipe } from '../pipes/safe.pipe';

import { AppComponent } from './app.component';
import { PromptModalComponent } from './modals/prompt-modal/prompt-modal.component';
import { SettingsMenuComponent } from './modals/settings-menu/settings-menu.component';
import { OptionsContextmenuComponent } from './options-contextmenu/options-contextmenu.component';
import { SessionDetailComponent } from './session-detail/session-detail.component';
import { SessionCardComponent } from './session-panel-list/session-card/session-card.component';
import { SessionPanelListComponent } from './session-panel-list/session-panel-list.component';
import { SessionSearchComponent } from './session-panel-list/session-search/session-search.component';
import { ExportModalComponent } from './modals/export-modal/export-modal.component';
import { ImportModalComponent } from './modals/import-modal/import-modal.component';




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
        SortTabByPipe,
        RequestFocusDirective,
        ScrollToIfActiveDirective,
        OptionsContextmenuComponent,
        SettingsMenuComponent,
        ExportModalComponent,
        ImportModalComponent
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
        MatDividerModule,
        MatTabsModule
    ],
    providers: [{ provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: { position: 'above' } as MatTooltipDefaultOptions }],
    bootstrap: [AppComponent]
})
export class AppModule { }
