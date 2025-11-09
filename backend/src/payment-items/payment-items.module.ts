import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentItem } from './payment-item.entity';
import { PaymentItemsController } from './payment-items.controller';
import { PaymentItemsService } from './payment-items.service';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentItem])],
  controllers: [PaymentItemsController],
  providers: [PaymentItemsService],
  exports: [PaymentItemsService],
})
export class PaymentItemsModule {}