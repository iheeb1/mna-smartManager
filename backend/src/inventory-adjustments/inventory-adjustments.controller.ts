import { Controller, Post, Body, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ApiResponse } from 'src/shared/dto/api-response.dto';
import { StringUtils } from 'src/shared/utils/string.utils';
import { InventoryAdjustmentRequestDto, SaveInventoryAdjustmentDto } from './dto/inventory-adjustments.dto';
import { InventoryAdjustmentService } from './inventory-adjustments.service';


@Controller('api/sminventoryadjustment')
@UseGuards(JwtAuthGuard)
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class InventoryAdjustmentController {
  constructor(
    private readonly inventoryAdjustmentService: InventoryAdjustmentService,
  ) {}

  @Post()
  async handleRequest(
    @Body() body: InventoryAdjustmentRequestDto,
  ): Promise<ApiResponse<any>> {
    try {
      const reqType = StringUtils.toString(body.ReqType);
      const reqObject = body.ReqObject;

      switch (reqType) {
        case 'SaveInventoryAdjustmentDetails':
          return await this.saveInventoryAdjustmentDetails(reqObject);

        case 'GetInventoryAdjustmentsList':
          return await this.getInventoryAdjustmentsList(reqObject);

        case 'GetInventoryAdjustmentDetails':
          return await this.getInventoryAdjustmentDetails(reqObject);

        case 'DeleteInventoryAdjustment':
          return await this.deleteInventoryAdjustment(reqObject);

        case 'ChangeInventoryAdjustmentStatus':
          return await this.changeInventoryAdjustmentStatus(reqObject);

        case 'GetMaxInventoryAdjustmentsId':
          return await this.getMaxInventoryAdjustmentsId();

        default:
          return ApiResponse.error('Invalid request type');
      }
    } catch (error) {
      return ApiResponse.error(error.message);
    }
  }

  private async saveInventoryAdjustmentDetails(
    reqObject: any,
  ): Promise<ApiResponse<any>> {
    if (!reqObject) {
      return ApiResponse.error('Request object is required');
    }

    const adjustment = await this.inventoryAdjustmentService.saveInventoryAdjustmentDetails(
      reqObject as SaveInventoryAdjustmentDto,
    );

    if (adjustment) {
      return ApiResponse.success(adjustment, 'Success');
    }

    return ApiResponse.error('Failed to save inventory adjustment');
  }

  private async getInventoryAdjustmentsList(
    reqObject: any,
  ): Promise<ApiResponse<any>> {
    if (!reqObject) {
      return ApiResponse.error('Request object is required');
    }

    const searchParams = {
      adjustmentId: StringUtils.toInt(reqObject.AdjustmentId),
      fromAdjustmentDate: StringUtils.toString(reqObject.AdjustmentDate?.FromDate),
      toAdjustmentDate: StringUtils.toString(reqObject.AdjustmentDate?.ToDate),
      adjustmentStatusId: StringUtils.toInt(reqObject.AdjustmentStatus?.LookUpId),
      adjustmentTypeId: StringUtils.toInt(reqObject.AdjustmentType?.LookUpId),
      createdBy: StringUtils.toInt(reqObject.CreatedBy?.UserId),
      modifiedBy: StringUtils.toInt(reqObject.ModifiedBy?.UserId),
      fromCreatedDate: StringUtils.toString(reqObject.CreatedDate?.FromDate),
      toCreatedDate: StringUtils.toString(reqObject.CreatedDate?.ToDate),
      fromModifiedDate: StringUtils.toString(reqObject.ModifiedDate?.FromDate),
      toModifiedDate: StringUtils.toString(reqObject.ModifiedDate?.ToDate),
      itemsPerPage: StringUtils.toInt(reqObject.ItemsPerPage),
      pageNumber: StringUtils.toInt(reqObject.PageNumber),
      includeAdjustmentItems: StringUtils.toBoolean(reqObject.includeAdjustmentItems),
    };

    const adjustments = await this.inventoryAdjustmentService.getInventoryAdjustmentsList(
      searchParams,
    );

    const includeTotalRowsLength = StringUtils.toBoolean(reqObject.IncludeTotalRowsLength);
    const totalRowsLength = includeTotalRowsLength ? adjustments.length : 0;
    const groupBy = StringUtils.toString(reqObject.GroupBy);

    switch (groupBy) {
      default:
        return ApiResponse.success(
          {
            TotalLength: totalRowsLength,
            RowsList: adjustments,
          },
          'Success',
        );
    }
  }

  private async getInventoryAdjustmentDetails(
    reqObject: any,
  ): Promise<ApiResponse<any>> {
    const adjustmentId = StringUtils.toInt(reqObject.AdjustmentId);
    const includeAdjustmentItems = StringUtils.toBoolean(reqObject.includeAdjustmentItems);

    if (!adjustmentId) {
      return ApiResponse.error('Adjustment ID is required');
    }

    const adjustment = await this.inventoryAdjustmentService.getInventoryAdjustmentDetails(
      adjustmentId,
      includeAdjustmentItems,
    );

    if (adjustment) {
      return ApiResponse.success(adjustment, 'Success');
    }

    return ApiResponse.error('Inventory adjustment not found');
  }

  private async deleteInventoryAdjustment(
    reqObject: any,
  ): Promise<ApiResponse<any>> {
    const adjustmentId = StringUtils.toInt(reqObject.AdjustmentId);

    if (!adjustmentId) {
      return ApiResponse.error('Adjustment ID is required');
    }

    await this.inventoryAdjustmentService.deleteInventoryAdjustment(adjustmentId);
    return ApiResponse.success(null, 'Success');
  }

  private async changeInventoryAdjustmentStatus(
    reqObject: any,
  ): Promise<ApiResponse<any>> {
    const adjustmentId = StringUtils.toInt(reqObject.AdjustmentId);
    const newStatusId = StringUtils.toInt(reqObject.AdjustmentStatusId);

    if (!adjustmentId) {
      return ApiResponse.error('Adjustment ID is required');
    }

    if (!newStatusId) {
      return ApiResponse.error('Adjustment Status ID is required');
    }

    const adjustment = await this.inventoryAdjustmentService.getInventoryAdjustmentDetails(
      adjustmentId,
      false,
    );

    if (!adjustment) {
      return ApiResponse.error('Inventory adjustment not found');
    }

    adjustment.adjustmentStatusId = newStatusId;
    const updatedAdjustment = await this.inventoryAdjustmentService.saveInventoryAdjustmentDetails(
      adjustment,
    );

    if (updatedAdjustment) {
      return ApiResponse.success(null, 'Success');
    }

    return ApiResponse.error('Failed to update adjustment status');
  }

  private async getMaxInventoryAdjustmentsId(): Promise<ApiResponse<any>> {
    const maxId = await this.inventoryAdjustmentService.getMaxInventoryAdjustmentsId();
    return ApiResponse.success(maxId, 'Success');
  }
}