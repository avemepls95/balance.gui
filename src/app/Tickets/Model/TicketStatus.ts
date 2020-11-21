export enum TICKET_STATUS {
    New = 'New',
    Assigned = 'Assigned',
    Closed = 'Closed',
    Cancelled = 'Cancelled',
}

export const TicketStatusLabel = new Map<string, string>([
  [TICKET_STATUS.New, 'Новая'],
  [TICKET_STATUS.Assigned, 'Назначена'],
  [TICKET_STATUS.Closed, 'Закрыта'],
  [TICKET_STATUS.Cancelled, 'Отменена'],
]);
