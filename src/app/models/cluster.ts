/**
 * Created by baimi on 2017/11/3.
 */
export class Cluster{
	public id:string;
	private avPrecursorMz:number;
	private specCount:number;
	private ratio:number;
	private consensusMz:number[];
	private consensusIntens:number[];
	public spectraTitles:string[];
}