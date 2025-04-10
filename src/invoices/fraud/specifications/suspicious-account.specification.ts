import { FraudReason } from '@prisma/client';
import {
  FraudDetectionResult,
  FraudSpecificationContext,
  IFraudSpecification,
} from './fraud-specification.interface';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SuspiciousAccountSpecification implements IFraudSpecification {
  detectFraud(context: FraudSpecificationContext): FraudDetectionResult {
    const { account } = context;

    // Check if the account is marked as suspicious
    if (account.isSuspicious) {
      return {
        hasFraud: true,
        fraudReason: FraudReason.SUSPICIOUS_ACCOUNT,
        description: `Account ${account.id} is marked as suspicious.`,
      };
    }

    return {
      hasFraud: false,
    };
  }
}
