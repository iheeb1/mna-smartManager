import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExpenseItemsController } from './expense-items.controller';
import { ExpenseItemsService } from './expense-items.service';
import { ExpenseItem } from './expense-items.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ExpenseItem])],
  controllers: [ExpenseItemsController],
  providers: [ExpenseItemsService],
  exports: [ExpenseItemsService],
})
export class ExpenseItemsModule {}