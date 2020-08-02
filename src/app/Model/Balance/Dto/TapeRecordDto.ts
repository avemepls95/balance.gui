import { TapeCheckProcessedDataDto } from './TapeCheckProcessedDataDto';
import { TapeTransferDataDto } from './TapeTransferDataDto';

export class TapeRecordDto {
    id: number;
    type: string;
    date: Date;
    data: TapeCheckProcessedDataDto | TapeTransferDataDto;

    public constructor(
        fields?: {
            id?: number,
            type?: string,
            date?: Date,
            data?: TapeCheckProcessedDataDto | TapeTransferDataDto;
        }) {
        if (fields) Object.assign(this, fields);
    }
}