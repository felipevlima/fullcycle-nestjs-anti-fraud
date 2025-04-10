import { Injectable } from '@nestjs/common';
import {
  FraudDetectionResult,
  FraudSpecificationContext,
  IFraudSpecification,
} from './fraud-specification.interface';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { FraudReason } from '@prisma/client';

@Injectable()
export class FrequentHighValueSpecificaiton implements IFraudSpecification {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}

  async detectFraud(
    context: FraudSpecificationContext,
  ): Promise<FraudDetectionResult> {
    const { account } = context;
    const suspiciousInvoiceCount = this.configService.getOrThrow<number>(
      'SUSPICIOUS_INVOICES_COUNT',
    );
    const suspiciousTimeframeHours = this.configService.getOrThrow<number>(
      'SUSPICIOUS_INVOICES_TIMEFRAME_HOURS',
    );

    const recentDate = new Date();
    recentDate.setHours(recentDate.getHours() - suspiciousTimeframeHours);
    const recentInvoices = await this.prisma.invoice.findMany({
      where: {
        accountId: account.id,
        createdAt: {
          gte: recentDate,
        },
      },
    });

    if (recentInvoices.length >= suspiciousInvoiceCount) {
      return {
        hasFraud: true,
        fraudReason: FraudReason.FREQUENT_HIGH_VALUE,
        description: `Account ${account.id} has more than 100 invoices in the last ${suspiciousTimeframeHours} hours`,
      };
    }

    return {
      hasFraud: false,
    };
  }
}
