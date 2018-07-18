/**
 * @description lorikeet specview's arguments needed by Spectra-comparer
 * Created by Ricardo on 2018.6.7
 */

export class SpecviewOption {
    sequence: string;
    charge: number;
    precursorMz: any;
    fileName: string;
    ctermMod?: any;
    variableMods: Array<{
        index: number,
        aminoAcid: string,
        modMass: number
    }>;
    ntermMod: number;
    peaks: Array<[number, number]>;
    peaks2: Array<[number, number]>;
}
