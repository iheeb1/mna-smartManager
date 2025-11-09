import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ExpenseItemsService } from './expense-items.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ApiResponse } from 'src/shared/dto/api-response.dto';
import { StringUtils } from '../shared/utils/string.utils';

@Controller('api/expense-items')
@UseGuards(JwtAuthGuard)
export class ExpenseItemsController {
  constructor(private readonly expenseItemsService: ExpenseItemsService) {}

  @Post()
  async handleRequest(@Body() body: any) {
    try {
      const reqType = StringUtils.toString(body.reqType);

      switch (reqType) {
        case 'SaveExpenseItemDetails': {
          const expenseItem = body.reqObject;
          if (expenseItem) {
            const saved = await this.expenseItemsService.saveExpenseItem(expenseItem);
            return ApiResponse.success(saved);
          }
          return ApiResponse.error('Failed');
        }

        case 'GetExpenseItemsList': {
          if (body.reqObject) {
            const result = await this.expenseItemsService.getExpenseItemsList(body.reqObject);
            return ApiResponse.success(result);
          }
          return ApiResponse.error('Failed');
        }

        case 'GetExpenseItemDetails': {
          const expenseItemId = StringUtils.toInt(body.reqObject?.expenseItemId);
          const item = await this.expenseItemsService.getExpenseItemDetails(expenseItemId);
          
          if (item) {
            return ApiResponse.success(item);
          }
          return ApiResponse.error('Failed');
        }

        case 'DeleteExpenseItem': {
          const expenseItemId = StringUtils.toInt(body.reqObject?.expenseItemId);
          await this.expenseItemsService.deleteExpenseItem(expenseItemId);
          return ApiResponse.success(null);
        }

        default:
          return ApiResponse.error('Invalid request type');
      }
    } catch (error: any) {
      return ApiResponse.error(error.message);
    }
  }
}