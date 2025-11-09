import { Controller, Post, Body, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { TransportationItemsService } from './transportation-items.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ApiResponse } from 'src/shared/dto/api-response.dto';
import { StringUtils } from 'src/shared/utils/string.utils';
import { TransportationItemRequestDto } from './dto/transportation-item.dto';

@Controller('api/smtransportationitem')
@UseGuards(JwtAuthGuard)
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class TransportationItemsController {
  constructor(private readonly transportationItemsService: TransportationItemsService) {}

  @Post()
  async handleRequest(@Body() body: TransportationItemRequestDto): Promise<ApiResponse<any>> {
    try {
      const reqType = StringUtils.toString(body.ReqType);
      const reqObject = body.ReqObject;

      switch (reqType) {
        case 'SaveTransportationItemDetails':
          return await this.saveTransportationItemDetails(reqObject);

        case 'GetTransportationsItemsList':
          return await this.getTransportationItemsList(reqObject);

        case 'GetTransportationItemDetails':
          return await this.getTransportationItemDetails(reqObject);

        case 'DeleteTransportationItem':
          return await this.deleteTransportationItem(reqObject);

        default:
          return ApiResponse.error('Invalid request type');
      }
    } catch (error) {
      return ApiResponse.error(error.message);
    }
  }

  private async saveTransportationItemDetails(reqObject: any): Promise<ApiResponse<any>> {
    if (!reqObject) {
      return ApiResponse.error('Request object is required');
    }

    const transportationItem = await this.transportationItemsService.saveTransportationItemDetails(reqObject);

    if (transportationItem) {
      return ApiResponse.success(transportationItem, 'Success');
    }

    return ApiResponse.error('Failed to save transportation item');
  }

  private async getTransportationItemsList(reqObject: any): Promise<ApiResponse<any>> {
    if (!reqObject) {
      return ApiResponse.error('Request object is required');
    }

    const searchParams = {
      transportationItemIds: StringUtils.toString(reqObject.TransportationItemIds),
      transportationIds: StringUtils.toString(reqObject.Transportation?.TransportationIds),
      shippingCertificateId: StringUtils.toString(reqObject.ShippingCertificateId),
      transportationStatusIds: StringUtils.toString(reqObject.TransportationItemStatus?.LookUpIds),
      createdByIds: StringUtils.toString(reqObject.CreatedBy?.UserIds),
      modifiedByIds: StringUtils.toString(reqObject.ModifiedBy?.UserIds),
      fromCreatedDate: StringUtils.toString(reqObject.CreatedDate?.FromDate),
      toCreatedDate: StringUtils.toString(reqObject.CreatedDate?.ToDate),
      fromModifiedDate: StringUtils.toString(reqObject.ModifiedDate?.FromDate),
      toModifiedDate: StringUtils.toString(reqObject.ModifiedDate?.ToDate),
      itemsPerPage: StringUtils.toInt(reqObject.ItemsPerPage),
      pageNumber: StringUtils.toInt(reqObject.PageNumber),
    };

    const transportationItems = await this.transportationItemsService.getTransportationItemsList(searchParams);

    return ApiResponse.success(transportationItems, 'Success');
  }

  private async getTransportationItemDetails(reqObject: any): Promise<ApiResponse<any>> {
    const transportationItemId = StringUtils.toInt(reqObject.TransportationItemId);

    if (!transportationItemId) {
      return ApiResponse.error('Transportation Item ID is required');
    }

    const transportationItem = await this.transportationItemsService.getTransportationItemDetails(transportationItemId);

    if (transportationItem) {
      return ApiResponse.success(transportationItem, 'Success');
    }

    return ApiResponse.error('Transportation item not found');
  }

  private async deleteTransportationItem(reqObject: any): Promise<ApiResponse<any>> {
    const transportationItemId = StringUtils.toInt(reqObject.TransportationItemId);

    if (!transportationItemId) {
      return ApiResponse.error('Transportation Item ID is required');
    }

    await this.transportationItemsService.deleteTransportationItem(transportationItemId);
    return ApiResponse.success(null, 'Success');
  }
}