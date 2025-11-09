import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ApiResponse } from 'src/shared/dto/api-response.dto';
import { StringUtils } from '../shared/utils/string.utils';

@Controller('api/expenses')
@UseGuards(JwtAuthGuard)
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Post()
  async handleRequest(@Body() body: any) {
    try {
      const reqType = StringUtils.toString(body.reqType);

      switch (reqType) {
        case 'SaveExpenseDetails': {
          const expense = body.reqObject;
          if (expense) {
            const savedExpense = await this.expensesService.saveExpense(expense);
            return ApiResponse.success(savedExpense);
          }
          return ApiResponse.error('Failed');
        }

        case 'GetExpensesList': {
          if (body.reqObject) {
            const result = await this.expensesService.getExpensesList(body.reqObject);
            return ApiResponse.success(result);
          }
          return ApiResponse.error('Failed');
        }

        case 'GetExpenseDetails': {
          const expenseId = StringUtils.toInt(body.reqObject?.expenseId);
          const includeExpenseItems = StringUtils.toBoolean(body.reqObject?.includeExpenseItems);
          const expense = await this.expensesService.getExpenseDetails(expenseId, includeExpenseItems);
          
          if (expense) {
            return ApiResponse.success(expense);
          }
          return ApiResponse.error('Failed');
        }

        case 'DeleteExpense': {
          const expenseId = StringUtils.toInt(body.reqObject?.expenseId);
          await this.expensesService.deleteExpense(expenseId);
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