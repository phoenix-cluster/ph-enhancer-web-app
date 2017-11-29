
export class Psm {
  static psmHeaders =
    [
     {"headName":"id", "order":"False"},
     {"headName":"peptideSequence", "order":"False"},
     {"headName":"confidentScore", "order":"asc"},
     {"headName":"clusterId", "order":"False"},
     {"headName":"clusterRatio", "order":"desc"},
     {"headName":"clusterSize", "order":"desc"},
     {"headName":"recommendPeptide", "order":"False"},
     {"headName":"spectraNum", "order":"False"},
     {"headName":"acceptence", "order":"False"}
   ];


   constructor(clusterId: string) {
      this.clusterId = clusterId;
   }

   private id:number;
private peptide:string;
private confidentScore:number;
public  clusterId:string;
private clusterRatio:number;
private clusterSize:number;
private recommendIdentification:string;
private spectraNum:number;
private spectraTitles:string;
private acceptence:string;
}
