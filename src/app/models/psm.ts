import {Modification} from "./modification";
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
            {"headName": "acceptance", "order": "True"}
        ];


    constructor(clusterId: string) {
        this.clusterId = clusterId;
    }

    id: number;
    peptideSequence: string;
    peptideMods: Modification[];
    confidentScore: number;
    clusterId: string;
    clusterRatio: number;
    clusterSize: number;
    recommendPeptide: string;
    recommendPepMods: Modification[];
    spectraNum: number;
    spectraTitles: string;
    acceptance: number;
}
