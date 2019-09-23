/**
 * Created by baimi on 2017/11/3.
 */
export class Cluster{
	id:string;
	avPrecursorMz:number;
	specCount:number;
	ratio:number;
	consensusMz:number[];
	consensusIntens:number[];
    spectraTitles:string[];
    sequencesRatios?:string;
}