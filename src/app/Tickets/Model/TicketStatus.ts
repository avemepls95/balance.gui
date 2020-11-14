export enum TICKET_STATUS {
    New = 'New',
    Assigned = 'Assigned',
    Closed = 'Closed'
}

// export enum TICKET_STATUS {
//   New,
//   Assigned,
//   Closed
// }

export const TicketStatusLabel = new Map<string, string>([
  [TICKET_STATUS.New, 'Новая'],
  [TICKET_STATUS.Assigned, 'Назначена'],
  [TICKET_STATUS.Closed, 'Закрыта']
]);
