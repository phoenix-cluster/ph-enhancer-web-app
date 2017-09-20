import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MDBBootstrapModule } from './typescripts/free';
import { AgmCoreModule } from '@agm/core';
import { AppComponent } from './app.component';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { AppHeaderComponent } from './components/app-header/app-header.component';
import { AppFooterComponent } from './components/app-footer/app-footer.component';
import { MainLeftMetricsComponent } from './components/main-left-metrics/main-left-metrics.component';
import { MainRightAnalysisComponent } from './components/main-right-analysis/main-right-analysis.component';
import { Chart1Component } from './components/main-left-metrics/chart1/chart1.component';
import { Chart2Component } from './components/main-left-metrics/chart2/chart2.component';
import { Chart4Component } from './components/main-left-metrics/chart4/chart4.component';
import { Chart3Component } from './components/main-left-metrics/chart3/chart3.component';
import { DescriptionComponent } from './components/main-left-metrics/description/description.component';

@NgModule({
  declarations: [
    AppComponent,
    AppHeaderComponent,
    AppFooterComponent,
    MainLeftMetricsComponent,
    MainRightAnalysisComponent,
    Chart1Component,
    Chart2Component,
    Chart4Component,
    Chart3Component,
    DescriptionComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpModule,
    MDBBootstrapModule.forRoot(),
    NgbModule.forRoot(),
    AgmCoreModule.forRoot({
      // https://developers.google.com/maps/documentation/javascript/get-api-key?hl=en#key
      apiKey: 'Your_api_key'
    })
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas:      [ NO_ERRORS_SCHEMA ]
})
export class AppModule { }
