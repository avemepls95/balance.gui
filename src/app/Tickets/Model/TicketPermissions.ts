export class TicketPermissions {
  canEdit: boolean;
  canAssign: boolean;
  canClose: boolean;
  canReopen: boolean;
  canComplete: boolean;
  canDecline: boolean;
  canCancel: boolean;

  public constructor(fields?: {
    canEdit?: boolean;
    canAssign?: boolean;
    canClose?: boolean;
    canReopen?: boolean;
    canComplete?: boolean;
    canDecline?: boolean;
    canCancel?: boolean;
  }) {
    if (fields) Object.assign(this, fields);
  }
}
