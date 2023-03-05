export class TransactionResponse {
    transactionId: string;
    userId: string;
    from: string;
    to: string;
    resultValue: number;
    originValue: number;
    rate: number;
    transactionDate: Date;
}