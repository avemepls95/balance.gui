import { isNullOrUndefined } from "util";

export class TableUtils {
    static setColumnVisible(
        columns: string[],
        title: string,
        visibility: boolean): void 
    {
        if (isNullOrUndefined(visibility))
            return;

        let index = columns.indexOf(title);
        if (index != -1) {
            if (!visibility)
                columns.splice(index, 1);

            return;
        }

        if (!visibility)
            return;

        columns.push(title);
    }
}