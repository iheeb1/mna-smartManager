import { TypeOrmModule } from "@nestjs/typeorm";
import { Module } from "@nestjs/common";
import { Car } from "src/cars/car.entity";
import { Customer } from "src/customers/entities/customer.entity";
import { OrderItem } from "src/order-items/order-item.entity";
import { Order } from "src/orders/order.entity";
import { PaymentItem } from "src/payment-items/payment-item.entity";
import { Payment } from "src/payments/payment.entity";
import { Transaction } from "./transactions.entity";
import { TransactionController } from "./transactions.controller";
import { TransactionService } from "./transactions.service";


@Module({
  imports: [
    TypeOrmModule.forFeature([
      Transaction,
      Order,
      OrderItem,
      Payment,
      PaymentItem,
      Customer,
      Car
    ])
  ],
  controllers: [TransactionController],
  providers: [TransactionService],
  exports: [TransactionService]
})
export class TransactionModule {}