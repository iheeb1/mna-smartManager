import { Controller, Post, Body, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { InventoryAdjustmentItemsService } from './inventory-adjustment-items.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ApiResponse } from 'src/shared/dto/api-response.dto';
import { StringUtils } from 'src/shared/utils/string.utils';
import { InventoryAdjustmentItemRequestDto, SaveInventoryAdjustmentItemDto, GetInventoryAdjustmentItemsListDto, GetInventoryAdjustmentItemDetailsDto, DeleteInventoryAdjustmentItemDto } from './dto/inventory-adjustment-item.dto';


@Controller('api/sminventoryadjustmentitem')
@UseGuards(JwtAuthGuard)
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class InventoryAdjustmentItemsController {
  constructor(
    private readonly inventoryAdjustmentItemsService: InventoryAdjustmentItemsService,
  ) {}

  @Post()
  async handleRequest(
    @Body() body: InventoryAdjustmentItemRequestDto,
  ): Promise<ApiResponse<any>> {
    try {
      const reqType = StringUtils.toString(body.ReqType);
      const reqObject = body.ReqObject;

      switch (reqType) {
        case 'SaveInventoryAdjustmentItemDetails':
          return await this.saveInventoryAdjustmentItemDetails(reqObject);

        case 'GetInventoryAdjustmentItemsList':
          return await this.getInventoryAdjustmentItemsList(reqObject);

        case 'GetInventoryAdjustmentItemDetails':
          return await this.getInventoryAdjustmentItemDetails(reqObject);

        case 'DeleteInventoryAdjustmentItem':
          return await this.deleteInventoryAdjustmentItem(reqObject);

        default:
          return ApiResponse.error('Invalid request type');
      }
    } catch (error) {
      return ApiResponse.error(error.message);
    }
  }

  private async saveInventoryAdjustmentItemDetails(
    reqObject: SaveInventoryAdjustmentItemDto,
  ): Promise<ApiResponse<any>> {
    if (!reqObject) {
      return ApiResponse.error('Request object is required');
    }

    const item = await this.inventoryAdjustmentItemsService.saveInventoryAdjustmentItemDetails(
      reqObject,
    );

    if (item) {
      return ApiResponse.success(item, 'Success');
    }

    return ApiResponse.error('Failed to save inventory adjustment item');
  }

  private async getInventoryAdjustmentItemsList(
    reqObject: GetInventoryAdjustmentItemsListDto,
  ): Promise<ApiResponse<any>> {
    if (!reqObject) {
      return ApiResponse.error('Request object is required');
    }

    const searchParams = {
      adjustmentItemId: StringUtils.toInt(reqObject.AdjustmentItemId),
      adjustmentId: StringUtils.toInt(reqObject.Adjustment?.AdjustmentId),
      productItemId: StringUtils.toInt(reqObject.Product?.ProductId),
      referenceNumber: StringUtils.toString(reqObject.ReferenceNumber),
      adjustmentItemStatusId: StringUtils.toInt(reqObject.AdjustmentItemStatus?.LookUpId),
      adjustmentItemReasonId: StringUtils.toInt(reqObject.AdjustmentItemReason?.LookUpId),
      createdBy: StringUtils.toInt(reqObject.CreatedBy?.UserId),
      modifiedBy: StringUtils.toInt(reqObject.ModifiedBy?.UserId),
      fromCreatedDate: StringUtils.toString(reqObject.CreatedDate?.FromDate),
      toCreatedDate: StringUtils.toString(reqObject.CreatedDate?.ToDate),
      fromModifiedDate: StringUtils.toString(reqObject.ModifiedDate?.FromDate),
      toModifiedDate: StringUtils.toString(reqObject.ModifiedDate?.ToDate),
      itemsPerPage: StringUtils.toInt(reqObject.ItemsPerPage),
      pageNumber: StringUtils.toInt(reqObject.PageNumber),
    };

    const items = await this.inventoryAdjustmentItemsService.getInventoryAdjustmentItemsList(
      searchParams,
    );

    const includeTotalRowsLength = StringUtils.toBoolean(reqObject.IncludeTotalRowsLength);
    const totalRowsLength = includeTotalRowsLength ? items.length : 0;
    const groupBy = StringUtils.toString(reqObject.GroupBy);

    switch (groupBy) {
      case 'Adjustment':
        const groupedByAdjustment = this.groupByAdjustment(items);
        return ApiResponse.success(
          {
            TotalLength: totalRowsLength,
            RowsList: groupedByAdjustment,
          },
          'Success',
        );

      case 'Date':
        const groupedByDate = this.groupByDate(items);
        return ApiResponse.success(
          {
            TotalLength: totalRowsLength,
            RowsList: groupedByDate,
          },
          'Success',
        );

      default:
        return ApiResponse.success(
          {
            TotalLength: totalRowsLength,
            RowsList: items,
          },
          'Success',
        );
    }
  }

  private async getInventoryAdjustmentItemDetails(
    reqObject: GetInventoryAdjustmentItemDetailsDto,
  ): Promise<ApiResponse<any>> {
    const adjustmentItemId = StringUtils.toInt(reqObject.AdjustmentItemId);

    if (!adjustmentItemId) {
      return ApiResponse.error('Adjustment Item ID is required');
    }

    const item = await this.inventoryAdjustmentItemsService.getInventoryAdjustmentItemDetails(
      adjustmentItemId,
    );

    if (item) {
      return ApiResponse.success(item, 'Success');
    }

    return ApiResponse.error('Inventory adjustment item not found');
  }

  private async deleteInventoryAdjustmentItem(
    reqObject: DeleteInventoryAdjustmentItemDto,
  ): Promise<ApiResponse<any>> {
    const adjustmentItemId = StringUtils.toInt(reqObject.AdjustmentItemId);

    if (!adjustmentItemId) {
      return ApiResponse.error('Adjustment Item ID is required');
    }

    await this.inventoryAdjustmentItemsService.deleteInventoryAdjustmentItem(
      adjustmentItemId,
    );
    return ApiResponse.success(null, 'Success');
  }

  private groupByAdjustment(items: any[]): any[] {
    const grouped = items.reduce((acc, item) => {
      const adjustmentId = item.adjustmentId;

      if (!acc[adjustmentId]) {
        acc[adjustmentId] = [];
      }

      acc[adjustmentId].push(item);
      return acc;
    }, {});

    return Object.keys(grouped).map((adjustmentId) => ({
      Item: parseInt(adjustmentId),
      SubList: grouped[adjustmentId].sort(
        (a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime(),
      ),
    }));
  }

  private groupByDate(items: any[]): any[] {
    const grouped = items.reduce((acc, item) => {
      // Extract short date (YYYY-MM-DD) from createdDate
      const date = new Date(item.createdDate);
      const shortDate = date.toISOString().split('T')[0];

      if (!acc[shortDate]) {
        acc[shortDate] = [];
      }

      acc[shortDate].push(item);
      return acc;
    }, {});

    return Object.keys(grouped)
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
      .map((shortDate) => ({
        Item: shortDate,
        SubList: grouped[shortDate].sort(
          (a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime(),
        ),
      }));
  }
}