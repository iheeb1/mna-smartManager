import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExpensesController } from './expenses.controller';
import { ExpensesService } from './expenses.service';
import { Expense } from './expenses.entity';
import { ExpenseItem } from '../expense-items/expense-items.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Expense, ExpenseItem])],
  controllers: [ExpensesController],
  providers: [ExpensesService],
  exports: [ExpensesService],
})
export class ExpensesModule {}