import { Component, OnInit, Output } from '@angular/core';
import { ClusterService } from '../../services/cluster.service';
import { ActivatedRoute } from '@angular/router';
import { Cluster } from '../../model/cluster';
import { Spectrum } from '../../model/spectrum';
import { Page } from '../../model/page';
import { SpectrumService } from '../../services/spectrum.service';

@Component({
  selector: 'app-cluster-details',
  templateUrl: './cluster-details.component.html',
  styleUrls: ['./cluster-details.component.scss']
})
export class ClusterDetailsComponent implements OnInit {
  
  clusterId : string;
  currentCluster : Cluster;
  page : Page;
  spec_rows : Array<Spectrum>;
  selectedSpectrum : Spectrum;
  constructor(private clusterService : ClusterService,
              private route : ActivatedRoute,
              private spectrumService : SpectrumService) {
                 
    this.currentCluster = new Cluster();
    this.page = new Page();
    this.spec_rows = new Array<Spectrum>();
    this.clusterId = this.route.snapshot.paramMap.get('clusterId');         
   }

  ngOnInit() {
    this.setClusterPage();
    // console.log(this.currentCluster);
  }
  private setClusterPage() : void {
    this.clusterService.getACluster(this.clusterId).then(cluster_0 => {
      this.currentCluster = cluster_0;
      // console.log(cluster_0);
      this.setSpectrumTable(this.currentCluster.spectraTitles);
    }).catch(this.handleError);
  }
  private  setSpectrumTable(spectraTitles: string[]): void {
    this.spec_rows = [];
    for (let i = 0; i < spectraTitles.length; i += 100) {
        let endIndex = i + 100;
        if (endIndex > spectraTitles.length) endIndex = spectraTitles.length;
        let tempSpectraTitlesStr = spectraTitles.slice(i, endIndex).join("||");
        this.spectrumService.getSpectra(tempSpectraTitlesStr)
            .then(spectra => {
                    // console.log(spectra);
                    this.spec_rows = this.spec_rows.concat(spectra);
                    // console.log(this.spec_rows[0]);
                }
            ).catch(this.handleError);
    }
  }
 
  onClickSpec(spectrum : Spectrum) : void{
    // console.log("click ...");
    console.log(spectrum);
    this.selectedSpectrum = spectrum;
  }
  
  private handleError(error: any): void {
    console.log('A error occurred', error);
  }
  setPage(event) {
    this.page.pageNumber = event.offset + 1;
  }
}
