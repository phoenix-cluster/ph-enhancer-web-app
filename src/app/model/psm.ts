import {Modification} from "./modification";
export class Psm {
    static psmHeaders =
        [
            {"name": "id", "order": "False"},
            {"name": "peptideSequence", "order": "False"},
            {"name": "confidentScore", "order": "asc"},
            {"name": "clusterId", "order": "False"},
            {"name": "clusterRatio", "order": "True"},
            {"name": "clusterSize", "order": "True"},
            {"name": "recommendPeptide", "order": "False"},
            {"name": "spectraNum", "order": "False"},
            {"name": "acceptance", "order": "True"}
        ];


    constructor(clusterId: string) {
        this.clusterId = clusterId;
    }

    id: number;
    peptideSequence: string;
    peptideMods: Modification[];
    confidentScore: number;
    recommConfidentScore: number;
    clusterId: string;
    clusterRatio: number;
    clusterRatioStr: string;
    clusterSize: number;
    recommendPeptide: string;
    recommendPepMods: Modification[];
    spectraNum: number;
    spectraTitles: string[];
    acceptance: number;
}
