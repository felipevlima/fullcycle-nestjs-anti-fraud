import { PrismaService } from 'src/prisma/prisma.service';
import {
  FraudDetectionResult,
  FraudSpecificationContext,
  IFraudSpecification,
} from './fraud-specification.interface';
import { ConfigService } from '@nestjs/config';
import { FraudReason } from '@prisma/client';

export class UnusualAmountSpecification implements IFraudSpecification {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}
  async detectFraud(
    context: FraudSpecificationContext,
  ): Promise<FraudDetectionResult> {
    const { account, amount } = context;
    const SUSPICIOUS_VARIANTION_PERCENTAG =
      this.configService.getOrThrow<number>('SUSPICIOUS_VARIANTION_PERCENTAG');
    const INVOICES_HISTORY_COUNT = this.configService.getOrThrow<number>(
      'INVOICES_HISTORY_COUNT',
    );

    const previousInvoices = await this.prisma.invoice.findMany({
      where: {
        accountId: account.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: INVOICES_HISTORY_COUNT,
    });

    if (previousInvoices.length > 0) {
      const totalAmount = previousInvoices.reduce((acc, invoice) => {
        return acc + invoice.amount;
      }, 0);

      const averageAmount = totalAmount / previousInvoices.length;

      if (
        amount >
        averageAmount * (1 + SUSPICIOUS_VARIANTION_PERCENTAG / 100) +
          averageAmount
      ) {
        return {
          hasFraud: true,
          fraudReason: FraudReason.UNUSUAL_PATTERN,
          description: `Amount ${amount} is higher than the average amount ${averageAmount}`,
        };
      }
    }

    return {
      hasFraud: false,
    };
  }
}
