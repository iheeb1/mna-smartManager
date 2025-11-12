import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { AgentsModule } from './agents/agents.module';
import { BackupsModule } from './backups/backups.module';
import { CarsModule } from './cars/cars.module';
import { CustomersModule } from './customers/customers.module';
import { DriversModule } from './drivers/drivers.module';
import { InventoryAdjustmentModule } from './inventory-adjustments/inventory-adjustments.module';
import { InventoryAdjustmentItemsModule } from './inventory-adjustment-items/inventory-adjustment-items.module';
import { OrdersModule } from './orders/orders.module';
import { OrderItemsModule } from './order-items/order-items.module';
import { PaymentsModule } from './payments/payments.module';
import { PaymentItemsModule } from './payment-items/payment-items.module';
import { ProductsModule } from './products/products.module';
import { QuotesModule } from './quotes/quotes.module';
import { QuoteItemsModule } from './quote-items/quote-items.module';
import { TransportationsModule } from './transportations/transportations.module';
import { TransportationItemsModule } from './transportation-items/transportation-items.module';
import { LookupsModule } from './lookups/lookups.module';
import { ExpensesModule } from './expenses/expenses.module';
import { ExpenseItemsModule } from './expense-items/expense-items.module';
import { ReportsModule } from './reports/reports.module';
import { TransactionModule } from './transactions/transactions.module'; // ✅ Import correct

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '3306'),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      autoLoadEntities: true,
      synchronize: true,
    }),
    UsersModule,
    AuthModule,
    AgentsModule,
    BackupsModule,
    CarsModule,
    CustomersModule,
    DriversModule,
    InventoryAdjustmentModule,
    InventoryAdjustmentItemsModule,
    OrdersModule,
    OrderItemsModule,
    PaymentsModule,
    PaymentItemsModule,
    ProductsModule,
    QuotesModule,
    QuoteItemsModule,
    TransportationsModule,
    TransportationItemsModule,
    LookupsModule,
    ExpensesModule,
    ExpenseItemsModule,
    ReportsModule,
    TransactionModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
