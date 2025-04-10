import { Account, FraudReason } from '@prisma/client';

export type FraudSpecificationContext = {
  account: Account;
  amount: number;
  invoiceId: string;
};

export type FraudDetectionResult = {
  hasFraud: boolean;
  fraudReason?: FraudReason;
  description?: string;
};

export interface IFraudSpecification {
  detectFraud(
    context: FraudSpecificationContext,
  ): Promise<FraudDetectionResult> | FraudDetectionResult;
}
