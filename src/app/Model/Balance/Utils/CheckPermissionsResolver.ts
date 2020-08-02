import { Check } from '../Check';

export class CheckPermissionsResolver {

    private _check: Check;
    private _canEditByTitleLookup: { [title: string]: boolean; } = {};

    constructor() { }

    setPermissionsObject(object: any): void {
        if (!object.id)
            return;

        this._check = object;
        this.setFieldsPersmissions();
    }

    private setFieldsPersmissions(): void {
        this._canEditByTitleLookup["title"] =
            !!this._check.roles[UserCheckRoles.Owner] ||
            !!this._check.roles[UserCheckRoles.Editor];
    }

    canEditProperty(name: string): boolean {
        let result = this._canEditByTitleLookup[name] as boolean;
        return result;
    }

    canEdit() {
        if (!this._check){
            console.log("[CheckPermissionsResolver] check is null or undefined.")
            return;
        }

        let result = this._check.roles.includes(UserCheckRoles.Owner) ||
            this._check.roles.includes(UserCheckRoles.Editor) ||
            this._check.roles.length == 0;

        return result;
    }
}

export enum UserCheckRoles {
    Owner = "OWNER",
    Editor = "EDITOR",
    Reader = "READER"
}