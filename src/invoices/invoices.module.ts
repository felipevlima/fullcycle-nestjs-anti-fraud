import { Module } from '@nestjs/common';
import { FraudService } from './fraud/fraud.service';
import { FrequentHighValueSpecificaiton } from './fraud/specifications/frequent-high-value.specification';
import { SuspiciousAccountSpecification } from './fraud/specifications/suspicious-account.specification';
import { UnusualAmountSpecification } from './fraud/specifications/unusual-amount.specification';
import { FraudAggregateSpecification } from './fraud/specifications/fraud-aggregate.specification.service';

@Module({
  providers: [
    FraudService,
    FrequentHighValueSpecificaiton,
    SuspiciousAccountSpecification,
    UnusualAmountSpecification,
    FraudAggregateSpecification,
    {
      provide: 'FRAUD_SPECIFICATIONS',
      useFactory: (
        frequentHighValueSpecification: FrequentHighValueSpecificaiton,
        suspiciousAccountSpecification: SuspiciousAccountSpecification,
        unusualAmountSpecification: UnusualAmountSpecification,
      ) => {
        return [
          frequentHighValueSpecification,
          suspiciousAccountSpecification,
          unusualAmountSpecification,
        ];
      },
      inject: [
        FrequentHighValueSpecificaiton,
        SuspiciousAccountSpecification,
        UnusualAmountSpecification,
      ],
    },
  ],
})
export class InvoicesModule {}
