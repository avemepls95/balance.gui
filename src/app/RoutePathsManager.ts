export class RoutePathsManager {
    private static balanceRoutes:string[] = [
        '/debts',
        '/checks',
        '/createCheck',
        '/editCheck',
        '/debts',
        '/tape'
    ];

    private static ticketsRoutes:string[] = [
        '/createTicket',
        '/editTicket',
        '/tickets'
    ];

    static isBalanceRoute(route: string) {
        return this.balanceRoutes.findIndex((r: string) => route.startsWith(r)) != -1;
    }

    static isTicketsRoute(route: string) {
        return this.ticketsRoutes.findIndex((r: string) => route.startsWith(r)) != -1;
    }
}

