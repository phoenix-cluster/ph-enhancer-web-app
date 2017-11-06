
export class Psm {
  static psmHeaders =
    [
     {"headName":"querySpectrumTitle", "order":"False"},
     {"headName":"previousIdentification", "order":"False"},
     {"headName":"confidentScore", "order":"asc"},
     {"headName":"clusterID", "order":"False"},
     {"headName":"clusterRatio", "order":"desc"},
     {"headName":"clusterSize", "order":"desc"},
     {"headName":"recommendIdentification", "order":"False"},
     {"headName":"acceptence", "order":"False"}
   ];
private id:number;
private querySpectrumTitle:string;
private previousIdentification:string;
private confidentScore:number;
public  clusterId:string;
private clusterRatio:number;
private clusterSize:number;
private recommendIdentification:string;
private acceptence:string;

}
