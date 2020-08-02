export class TapeCheckProcessedData {
    userId: number;
    checkId: number;
    balanceDiff: number;

    public constructor(
        fields?: {
            userId?: number,
            checkId?: number,
            balanceDiff?: number
        }) {
        if (fields) Object.assign(this, fields);
    }
}