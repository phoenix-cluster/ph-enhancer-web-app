import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MDBBootstrapModule } from './typescripts/free';
// import { AgmCoreModule } from '@agm/core';
import { AppComponent } from './app.component';
import { CommonModule }     from '@angular/common';
import { FileUploadModule } from 'ng2-file-upload';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import { AppHeaderComponent } from './components/app-header/app-header.component';
import { AppFooterComponent } from './components/app-footer/app-footer.component';

import { MainLeftMetricsComponent } from './components/main-left-metrics/main-left-metrics.component';
import { Chart1Component } from './components/main-left-metrics/chart1/chart1.component';
import { Chart2Component } from './components/main-left-metrics/chart2/chart2.component';
import { Chart3Component } from './components/main-left-metrics/chart3/chart3.component';
import { Chart4Component } from './components/main-left-metrics/chart4/chart4.component';
import { DescriptionComponent } from './components/main-left-metrics/description/description.component';

import { MainRightAnalysisComponent } from './components/main-right-analysis/main-right-analysis.component';
import { CheckExamplesComponent } from './components/main-right-analysis/check-examples/check-examples.component';
import { UploadFilesComponent } from './components/main-right-analysis/do-analysis/upload-files/upload-files.component';
import { SetParametersComponent } from './components/main-right-analysis/do-analysis/set-parameters/set-parameters.component';
import { DoAnalysisComponent } from './components/main-right-analysis/do-analysis/do-analysis.component';

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
    DescriptionComponent,
    CheckExamplesComponent,
    DoAnalysisComponent,
    UploadFilesComponent,
    SetParametersComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpModule,
    NgbModule.forRoot(),
    MDBBootstrapModule.forRoot(),
    CommonModule,
    FileUploadModule
    // AgmCoreModule.forRoot({
    //   // https://developers.google.com/maps/documentation/javascript/get-api-key?hl=en#key
    //   apiKey: 'Your_api_key'
    // })
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas:      [ NO_ERRORS_SCHEMA ]
})
export class AppModule { }
