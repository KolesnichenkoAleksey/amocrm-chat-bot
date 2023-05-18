export interface IUser {
    widgetUserSubdomain: string;
    accountId: number;
    authCode: string;
    paid: boolean;
    installed: boolean;
    testPeriod: boolean;
    startUsingDate: string;
    finishUsingDate: string;
}