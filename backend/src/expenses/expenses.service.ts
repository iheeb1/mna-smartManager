import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Expense } from './expenses.entity';
import { ExpenseItem } from '../expense-items/expense-items.entity';
import { StringUtils } from '../shared/utils/string.utils';

@Injectable()
export class ExpensesService {
  constructor(
    @InjectRepository(Expense)
    private expenseRepository: Repository<Expense>,
    @InjectRepository(ExpenseItem)
    private expenseItemRepository: Repository<ExpenseItem>,
  ) {}

  async saveExpense(expenseData: any): Promise<any> {
    const expense = this.expenseRepository.create({
      expenseId: expenseData.expenseId || undefined,
      customerId: expenseData.customer.customerId,
      expenseTypeId: expenseData.expenseType.lookUpId,
      expenseDate: expenseData.expenseDate.fullDate,
      expenseDiscount: expenseData.expenseDiscount,
      expenseStatusId: expenseData.expenseStatusId,
      expenseNotes: expenseData.expenseNotes,
      createdBy: expenseData.createdBy.userId,
    });

    const savedExpense = await this.expenseRepository.save(expense);

    if (savedExpense.expenseId > 0 && expenseData.expenseItems && expenseData.expenseItems.length > 0) {
      const itemsToProcess = expenseData.expenseItems.filter(
        (x: any) => x.expenseItemId > 0 || (x.expenseItemId <= 0 && x.expenseItemStatusId !== 99)
      );

      for (const item of itemsToProcess) {
        if (item.expenseItemStatusId === 99) {
          await this.expenseItemRepository.delete(item.expenseItemId);
        } else {
          const expenseItem = this.expenseItemRepository.create({
            expenseItemId: item.expenseItemId || undefined,
            expenseId: savedExpense.expenseId,
            expenseItemMethodId: item.expenseItemMethod.lookUpId,
            expenseItemBankId: item.expenseItemBank?.lookUpId,
            expenseItemBankAccountNumber: item.expenseItemBankAccountNumber,
            expenseItemBankBranchNumber: item.expenseItemBankBranchNumber,
            expenseItemAmount: item.expenseItemAmount,
            expenseItemCheckNumber: item.expenseItemCheckNumber,
            expenseItemCheckDueDate: item.expenseItemCheckDueDate?.fullDate,
            expenseItemCheckStatusId: item.expenseItemCheckStatus?.lookUpId,
            expenseItemReference: item.expenseItemReference,
            expenseItemStatusId: item.expenseItemStatusId,
            expenseItemNotes: item.expenseItemNotes,
            createdBy: item.createdBy?.userId || expenseData.createdBy.userId,
          });
          await this.expenseItemRepository.save(expenseItem);
        }
      }
    }

    return savedExpense;
  }

  async getExpensesList(filters: any): Promise<any> {
    const query = this.expenseRepository.createQueryBuilder('expense');

    if (filters.expenseIds) {
      query.andWhere('expense.expenseId IN (:...ids)', {
        ids: StringUtils.toIntArray(filters.expenseIds),
      });
    }

    if (filters.customer?.customerIds) {
      query.andWhere('expense.customerId IN (:...customerIds)', {
        customerIds: StringUtils.toIntArray(filters.customer.customerIds),
      });
    }

    if (filters.expenseType?.lookUpIds) {
      query.andWhere('expense.expenseTypeId IN (:...typeIds)', {
        typeIds: StringUtils.toIntArray(filters.expenseType.lookUpIds),
      });
    }

    if (filters.expenseStatusId) {
      query.andWhere('expense.expenseStatusId = :statusId', {
        statusId: filters.expenseStatusId,
      });
    }

    if (filters.expenseDate?.fromDate) {
      query.andWhere('expense.expenseDate >= :fromDate', {
        fromDate: filters.expenseDate.fromDate,
      });
    }

    if (filters.expenseDate?.toDate) {
      query.andWhere('expense.expenseDate <= :toDate', {
        toDate: filters.expenseDate.toDate,
      });
    }

    const itemsPerPage = filters.itemsPerPage || 30;
    const pageNumber = filters.pageNumber || 0;

    query.skip(pageNumber * itemsPerPage).take(itemsPerPage);

    const [expenses, totalLength] = await query.getManyAndCount();

    if (filters.groupBy === 'Date') {
      const grouped = this.groupByDate(expenses);
      return {
        totalLength: filters.includeTotalRowsLength ? totalLength : 0,
        rowsList: grouped,
      };
    }

    return {
      totalLength: filters.includeTotalRowsLength ? totalLength : 0,
      rowsList: expenses,
    };
  }

  async getExpenseDetails(expenseId: number, includeExpenseItems: boolean = false): Promise<any> {
    const queryOptions: any = {
      where: { expenseId },
    };

    if (includeExpenseItems) {
      queryOptions.relations = ['expenseItems'];
    }

    const expense = await this.expenseRepository.findOne(queryOptions);

    if (!expense) {
      return null;
    }

    // Filter out deleted items if they were loaded
    if (includeExpenseItems && expense.expenseItems) {
      expense.expenseItems = expense.expenseItems.filter(
        item => item.expenseItemStatusId !== 99
      );
    }

    return expense;
  }

  async deleteExpense(expenseId: number): Promise<void> {
    await this.expenseRepository.delete(expenseId);
  }

  private groupByDate(expenses: any[]): any[] {
    const grouped = expenses.reduce((acc: any, expense) => {
      const shortDate = new Date(expense.expenseDate).toLocaleDateString();
      if (!acc[shortDate]) {
        acc[shortDate] = [];
      }
      acc[shortDate].push(expense);
      return acc;
    }, {});

    return Object.entries(grouped).map(([shortDate, subList]: any) => ({
      shortDate,
      subList: subList.sort((a: any, b: any) => 
        new Date(b.expenseDate).getTime() - new Date(a.expenseDate).getTime()
      ),
    }));
  }
}