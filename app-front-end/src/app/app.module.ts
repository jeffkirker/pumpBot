import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ClarityModule } from '@clr/angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './header/header.component';
import { DetailsPanelComponent } from './details-panel/details-panel.component';
import { SubredditSelectComponent } from './subreddit-select/subreddit-select.component';
import { CompanySelectComponent } from './company-select/company-select.component';
import { ChartContainerComponent } from './chart-container/chart-container.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    DetailsPanelComponent,
    SubredditSelectComponent,
    CompanySelectComponent,
    ChartContainerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ClarityModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
