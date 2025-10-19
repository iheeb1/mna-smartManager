import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { LookupsService } from './lookups.service';
import { ApiResponse } from '../shared/dto/api-response.dto';
import { LookupRequestDto, GetLookupsDto } from './dto/lookup.dto';

@Controller('api/SMLookUp')
@UseGuards(AuthGuard('jwt'))
export class LookupsController {
  constructor(private readonly lookupsService: LookupsService) {}

  @Post()
  async post(@Body() body: LookupRequestDto): Promise<ApiResponse> {
    try {
      const { reqType, reqObject } = body;

      switch (reqType) {
        case 'SaveLookUpDetails':
          return await this.handleSaveLookupDetails(reqObject);

        case 'SaveChangedLookUp':
          return await this.handleSaveChangedLookup(reqObject);

        case 'GetLookUpsList':
          return await this.handleGetLookupsList(reqObject);

        case 'GetLookUpDetails':
          return await this.handleGetLookupDetails(reqObject);

        case 'GetLookUpsByTable':
          return await this.handleGetLookupsByTable(reqObject);

        case 'GetOrderTypes':
          return await this.handleGetOrderTypes();

        case 'GetTaxRate':
          return await this.handleGetTaxRate();

        case 'DeleteLookUp':
          return await this.handleDeleteLookup(reqObject);

        default:
          return ApiResponse.error('Invalid request type');
      }
    } catch (error) {
      return ApiResponse.error(error.message);
    }
  }

  /**
   * Handle SaveLookUpDetails request
   */
  private async handleSaveLookupDetails(reqObject: any): Promise<ApiResponse> {
    try {
      if (!reqObject) {
        return ApiResponse.error('ReqObject is required');
      }

      const savedLookup = await this.lookupsService.save(reqObject);

      // Reload with full details
      const lookupDetails = await this.lookupsService.getLookupDetails({
        lookUpId: savedLookup.lookUpId,
      });

      return ApiResponse.success(lookupDetails);
    } catch (error) {
      return ApiResponse.error(error.message);
    }
  }

  /**
   * Handle SaveChangedLookUp request (only saves if doesn't exist)
   */
  private async handleSaveChangedLookup(reqObject: any): Promise<ApiResponse> {
    try {
      if (!reqObject) {
        return ApiResponse.error('ReqObject is required');
      }

      const savedLookup = await this.lookupsService.saveChangedLookup(reqObject);

      if (savedLookup) {
        const lookupDetails = await this.lookupsService.getLookupDetails({
          lookUpId: savedLookup.lookUpId,
        });
        return ApiResponse.success(lookupDetails);
      }

      return ApiResponse.success({ message: 'Lookup already exists' });
    } catch (error) {
      return ApiResponse.error(error.message);
    }
  }

  /**
   * Handle GetLookUpsList request
   */
  private async handleGetLookupsList(reqObject: any): Promise<ApiResponse> {
    try {
      const params: GetLookupsDto = reqObject || {};
      const lookups = await this.lookupsService.getLookups(params);

      return ApiResponse.success(lookups);
    } catch (error) {
      return ApiResponse.error(error.message);
    }
  }

  /**
   * Handle GetLookUpDetails request
   */
  private async handleGetLookupDetails(reqObject: any): Promise<ApiResponse> {
    try {
      const lookupId = parseInt(reqObject.lookUpId || reqObject.LookUpId);

      if (!lookupId) {
        return ApiResponse.error('LookUpId is required');
      }

      const lookupData = await this.lookupsService.getLookupDetails({
        lookUpId: lookupId,
      });

      if (lookupData) {
        return ApiResponse.success(lookupData);
      }

      return ApiResponse.error('Lookup not found');
    } catch (error) {
      return ApiResponse.error(error.message);
    }
  }

  /**
   * Handle GetLookUpsByTable request
   */
  private async handleGetLookupsByTable(reqObject: any): Promise<ApiResponse> {
    try {
      const tableName = reqObject.lookUpTableName || reqObject.LookUpTableName;
      const statusId = reqObject.lookUpStatusId !== undefined 
        ? parseInt(reqObject.lookUpStatusId) 
        : 1;

      if (!tableName) {
        return ApiResponse.error('LookUpTableName is required');
      }

      const lookups = await this.lookupsService.getLookupsByTable(tableName, statusId);
      return ApiResponse.success(lookups);
    } catch (error) {
      return ApiResponse.error(error.message);
    }
  }

  /**
   * Handle GetOrderTypes request
   */
  private async handleGetOrderTypes(): Promise<ApiResponse> {
    try {
      const orderTypes = await this.lookupsService.getOrderTypes();
      return ApiResponse.success(orderTypes);
    } catch (error) {
      return ApiResponse.error(error.message);
    }
  }

  /**
   * Handle GetTaxRate request
   */
  private async handleGetTaxRate(): Promise<ApiResponse> {
    try {
      const taxRate = await this.lookupsService.getTaxRate();
      return ApiResponse.success({ taxRate });
    } catch (error) {
      return ApiResponse.error(error.message);
    }
  }

  /**
   * Handle DeleteLookUp request
   */
  private async handleDeleteLookup(reqObject: any): Promise<ApiResponse> {
    try {
      const lookupId = parseInt(reqObject.lookUpId || reqObject.LookUpId);

      if (!lookupId) {
        return ApiResponse.error('LookUpId is required');
      }

      await this.lookupsService.deleteLookup(lookupId);
      return ApiResponse.success(null);
    } catch (error) {
      return ApiResponse.error(error.message);
    }
  }
}