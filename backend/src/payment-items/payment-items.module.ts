import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentItemsController } from './payment-items.controller';
import { PaymentItemsService } from './payment-items.service';
import { PaymentItem } from './payment-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentItem])],
  controllers: [PaymentItemsController],
  providers: [PaymentItemsService],
  exports: [PaymentItemsService],
})
export class PaymentItemsModule {}