export class Psm {
    static psmHeaders =
        [
            {"headName": "id", "order": "False"},
            {"headName": "peptideSequence", "order": "False"},
            {"headName": "confidentScore", "order": "asc"},
            {"headName": "clusterId", "order": "False"},
            {"headName": "clusterRatio", "order": "True"},
            {"headName": "clusterSize", "order": "True"},
            {"headName": "recommendPeptide", "order": "False"},
            {"headName": "spectraNum", "order": "False"},
            {"headName": "acceptence", "order": "False"}
        ];


    constructor(clusterId: string) {
        this.clusterId = clusterId;
    }

    id: number;
    peptideSequence: string;
    confidentScore: number;
    clusterId: string;
    clusterRatio: number;
    clusterSize: number;
    recommendPeptide: string;
    spectraNum: number;
    spectraTitles: string;
    acceptence: boolean;
}
