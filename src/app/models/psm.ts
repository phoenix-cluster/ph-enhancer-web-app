
export class Psm {
  static psmHeaders =
    [
     {"headName":"querySpectrumTitle", "order":"False"},
     {"headName":"peptide", "order":"False"},
     {"headName":"confidentScore", "order":"asc"},
     {"headName":"clusterId", "order":"False"},
     {"headName":"clusterRatio", "order":"desc"},
     {"headName":"clusterSize", "order":"desc"},
     {"headName":"suggestedPeptide", "order":"False"},
     {"headName":"acceptence", "order":"False"}
   ];
private id:number;
private querySpectrumTitle:string;
private peptide:string;
private confidentScore:number;
private clusterId:string;
private clusterRatio:number;
private clusterSize:number;
private suggestedPeptide:string;
private acceptence:string;

}
