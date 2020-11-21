export class PermissionsDto {
  canEdit: boolean;
  canAssign: boolean;
  canClose: boolean;
  canReopen: boolean;
  canComplete: boolean;
  canDecline: boolean;
  canCancelUnitResult: boolean;
  canCancel: boolean;

  public constructor(fields?: {
    canEdit: boolean;
    canAssign: boolean;
    canClose: boolean;
    canReopen: boolean;
    canComplete: boolean;
    canDecline: boolean;
    canCancel: boolean;
    canCancelUnitResult: boolean;
  }) {
    if (fields) Object.assign(this, fields);
  }
}
