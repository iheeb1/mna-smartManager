import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { Customer } from 'src/customers/entities/customer.entity';
import { Payment } from '../payments/payment.entity';
import { PaymentItem } from '../payment-items/payment-item.entity';
import { Backup } from '../backups/backup.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Customer,
      Payment,
      PaymentItem,
      Backup,
    ]),
  ],
  controllers: [ReportsController],
  providers: [ReportsService],
  exports: [ReportsService],
})
export class ReportsModule {}