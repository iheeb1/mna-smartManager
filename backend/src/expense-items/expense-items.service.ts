import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExpenseItem } from './expense-items.entity';
import { StringUtils } from '../shared/utils/string.utils';

@Injectable()
export class ExpenseItemsService {
  constructor(
    @InjectRepository(ExpenseItem)
    private expenseItemRepository: Repository<ExpenseItem>,
  ) {}

  async saveExpenseItem(itemData: any): Promise<any> {
    const expenseItem = this.expenseItemRepository.create({
      expenseItemId: itemData.expenseItemId || undefined,
      expenseId: itemData.expense.expenseId,
      expenseItemMethodId: itemData.expenseItemMethod.lookUpId,
      expenseItemBankId: itemData.expenseItemBank?.lookUpId,
      expenseItemBankAccountNumber: itemData.expenseItemBankAccountNumber,
      expenseItemBankBranchNumber: itemData.expenseItemBankBranchNumber,
      expenseItemAmount: itemData.expenseItemAmount,
      expenseItemCheckNumber: itemData.expenseItemCheckNumber,
      expenseItemCheckDueDate: itemData.expenseItemCheckDueDate?.fullDate,
      expenseItemCheckStatusId: itemData.expenseItemCheckStatus?.lookUpId,
      expenseItemReference: itemData.expenseItemReference,
      expenseItemStatusId: itemData.expenseItemStatusId,
      expenseItemNotes: itemData.expenseItemNotes,
      createdBy: itemData.createdBy.userId,
    });

    return await this.expenseItemRepository.save(expenseItem);
  }

  async getExpenseItemsList(filters: any): Promise<any> {
    const query = this.expenseItemRepository.createQueryBuilder('expenseItem');

    if (filters.expenseItemIds) {
      query.andWhere('expenseItem.expenseItemId IN (:...ids)', {
        ids: StringUtils.toIntArray(filters.expenseItemIds),
      });
    }

    if (filters.expenseIds) {
      query.andWhere('expenseItem.expenseId IN (:...expenseIds)', {
        expenseIds: StringUtils.toIntArray(filters.expenseIds),
      });
    }

    if (filters.expenseItemMethod?.lookUpIds) {
      query.andWhere('expenseItem.expenseItemMethodId IN (:...methodIds)', {
        methodIds: StringUtils.toIntArray(filters.expenseItemMethod.lookUpIds),
      });
    }

    if (filters.expenseItemStatusIds) {
      query.andWhere('expenseItem.expenseItemStatusId IN (:...statusIds)', {
        statusIds: StringUtils.toIntArray(filters.expenseItemStatusIds),
      });
    }

    const itemsPerPage = filters.itemsPerPage || 30;
    const pageNumber = filters.pageNumber || 0;

    query.skip(pageNumber * itemsPerPage).take(itemsPerPage);

    const [items, totalLength] = await query.getManyAndCount();

    if (filters.groupBy === 'Date') {
      const grouped = this.groupByDate(items);
      return {
        totalLength: filters.includeTotalRowsLength ? totalLength : 0,
        rowsList: grouped,
      };
    }

    return {
      totalLength: filters.includeTotalRowsLength ? totalLength : 0,
      rowsList: items,
    };
  }

  async getExpenseItemDetails(expenseItemId: number): Promise<any> {
    return await this.expenseItemRepository.findOne({
      where: { expenseItemId },
      relations: ['expense'],
    });
  }

  async deleteExpenseItem(expenseItemId: number): Promise<void> {
    await this.expenseItemRepository.delete(expenseItemId);
  }

  private groupByDate(items: any[]): any[] {
    const grouped = items.reduce((acc: any, item) => {
      const shortDate = new Date(item.createdDate).toLocaleDateString();
      if (!acc[shortDate]) {
        acc[shortDate] = [];
      }
      acc[shortDate].push(item);
      return acc;
    }, {});

    return Object.entries(grouped).map(([shortDate, subList]: any) => ({
      shortDate,
      subList: subList.sort((a: any, b: any) => 
        new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()
      ),
    }));
  }
}
