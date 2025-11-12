import { Controller, Post, Body, UseGuards, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { TransactionRequestDto, ApiResponseDto, TransactionListResponseDto } from './dto/transaction.dto';
import { TransactionService } from './transactions.service';

@ApiTags('Transactions')
@Controller('api/SMTransaction')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TransactionController {
  private readonly logger = new Logger(TransactionController.name);

  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  @ApiOperation({ summary: 'Handle transaction requests' })
  @ApiResponse({ status: 200, description: 'Transaction data retrieved successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async handleTransactionRequest(@Body() requestDto: TransactionRequestDto): Promise<ApiResponseDto<TransactionListResponseDto | null>> {
    try {
      const { reqType, reqObject } = requestDto;
      this.logger.log(`Processing request type: ${reqType}`);

      switch (reqType) {
        case 'GetGroupedTransactionsList':
          return await this.getGroupedTransactionsList(reqObject);
        case 'GetDetailedTransactionsList':
          return await this.getDetailedTransactionsList(reqObject);
        default:
          throw new HttpException(`Unknown request type: ${reqType}`, HttpStatus.BAD_REQUEST);
      }
    } catch (error) {
      this.logger.error(`Error handling transaction request: ${error.message}`, error.stack);
      if (error instanceof HttpException) throw error;
      return new ApiResponseDto(false, -1, error.message || 'An error occurred', null);
    }
  }

  private async getGroupedTransactionsList(searchDto: any): Promise<ApiResponseDto<TransactionListResponseDto | null>> {
    try {
      if (!searchDto) return new ApiResponseDto(false, -1, 'Request object is required', null);
      const result = await this.transactionService.getGroupedTransactionsList(searchDto);
      return new ApiResponseDto(true, -1, 'Success', result);
    } catch (error) {
      this.logger.error(`Error in getGroupedTransactionsList: ${error.message}`, error.stack);
      throw new HttpException(error.message || 'Failed to retrieve grouped transactions', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  private async getDetailedTransactionsList(searchDto: any): Promise<ApiResponseDto<TransactionListResponseDto | null>> {
    try {
      if (!searchDto) return new ApiResponseDto(false, -1, 'Request object is required', null);
      const result = await this.transactionService.getDetailedTransactionsList(searchDto);
      return new ApiResponseDto(true, -1, 'Success', result);
    } catch (error) {
      this.logger.error(`Error in getDetailedTransactionsList: ${error.message}`, error.stack);
      throw new HttpException(error.message || 'Failed to retrieve detailed transactions', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}