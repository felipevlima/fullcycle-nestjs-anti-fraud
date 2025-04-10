import { Controller, Get, Param, Query } from '@nestjs/common';
import { FindAllInvoiceDto } from './dto/find-all-invoice.dto';
import { InvoicesService } from './invoices.service';

@Controller('invoices')
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Get()
  findAll(@Query() filter: FindAllInvoiceDto) {
    return this.invoicesService.findAll({
      withFraud: filter.withFraud,
      accountId: filter.accountId,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.invoicesService.findOne(id);
  }
}
