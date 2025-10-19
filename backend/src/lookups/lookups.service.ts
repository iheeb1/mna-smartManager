import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Lookup } from './lookup.entity';
import { GetLookupsDto, SaveLookupDto } from './dto/lookup.dto';

@Injectable()
export class LookupsService {
  constructor(
    @InjectRepository(Lookup)
    private readonly lookupRepository: Repository<Lookup>,
  ) {}

  /**
   * Get lookups with filtering
   */
  async getLookups(params: GetLookupsDto): Promise<any[]> {
    const query = this.buildLookupsQuery(params);
    const lookups = await query.getRawMany();
    return this.mapLookupsResponse(lookups);
  }

  /**
   * Get single lookup details
   */
  async getLookupDetails(params: GetLookupsDto): Promise<any> {
    const query = this.buildLookupsQuery(params);
    const lookup = await query.getRawOne();
    return lookup ? this.mapLookupResponse(lookup) : null;
  }

  /**
   * Get lookups by table name (most common use case)
   */
  async getLookupsByTable(tableName: string, statusId: number = 1): Promise<any[]> {
    return this.getLookups({
      lookUpTableName: tableName,
      lookUpStatusId: statusId,
    });
  }

  /**
   * Get order types for dropdown
   */
  async getOrderTypes(): Promise<any[]> {
    return this.getLookupsByTable('OrderType');
  }

  /**
   * Get tax rate
   */
  async getTaxRate(): Promise<number> {
    const taxLookup = await this.getLookupDetails({
      lookUpTableName: 'TaxRate',
      lookUpStatusId: 1,
    });

    if (taxLookup && taxLookup.param1) {
      return parseFloat(taxLookup.param1) || 0;
    }

    return 0.17;
  }

  /**
   * Save (insert or update) lookup
   */
  async save(lookupDto: SaveLookupDto): Promise<Lookup> {
    const lookup = new Lookup();

    if (lookupDto.lookUpId && lookupDto.lookUpId > 0) {
      const existingLookup = await this.lookupRepository.findOne({
        where: { lookUpId: lookupDto.lookUpId },
      });

      if (!existingLookup) {
        throw new Error('Lookup not found');
      }

      Object.assign(existingLookup, {
        lookUpTableName: lookupDto.lookUpTableName,
        lookUpCode: lookupDto.lookUpCode,
        lookUpName: lookupDto.lookUpName,
        param1: lookupDto.param1,
        param2: lookupDto.param2,
        param3: lookupDto.param3,
        lookUpStatusId: lookupDto.lookUpStatusId || 1,
        lookUpTypeId: lookupDto.lookUpTypeId || 0,
        lookUpTypeName: lookupDto.lookUpTypeName,
        lookUpData: lookupDto.lookUpData ? JSON.stringify(lookupDto.lookUpData) : null,
        modifiedBy: lookupDto.modifiedBy || 1,
      });

      return await this.lookupRepository.save(existingLookup);
    } else {
      Object.assign(lookup, {
        lookUpTableName: lookupDto.lookUpTableName,
        lookUpCode: lookupDto.lookUpCode,
        lookUpName: lookupDto.lookUpName,
        param1: lookupDto.param1,
        param2: lookupDto.param2,
        param3: lookupDto.param3,
        lookUpStatusId: lookupDto.lookUpStatusId || 1,
        lookUpTypeId: lookupDto.lookUpTypeId || 0,
        lookUpTypeName: lookupDto.lookUpTypeName,
        lookUpData: lookupDto.lookUpData ? JSON.stringify(lookupDto.lookUpData) : null,
        createdBy: lookupDto.createdBy || 1,
        modifiedBy: lookupDto.modifiedBy || 1,
      });

      return await this.lookupRepository.save(lookup);
    }
  }

  /**
   * Save changed lookup (only if doesn't exist)
   */
  async saveChangedLookup(lookupDto: SaveLookupDto): Promise<Lookup | null> {
    const existingLookup = await this.getLookupDetails({
      lookUpTableName: lookupDto.lookUpTableName,
      lookUpName: lookupDto.lookUpName.trim(),
    });

    if (!existingLookup) {
      lookupDto.lookUpId = 0;
      return await this.save(lookupDto);
    }

    return null;
  }

  /**
   * Delete lookup by ID
   */
  async deleteLookup(lookUpId: number): Promise<void> {
    await this.lookupRepository.delete(lookUpId);
  }

  /**
   * Build query for lookups with all filters
   */
  private buildLookupsQuery(params: GetLookupsDto): SelectQueryBuilder<Lookup> {
    const query = this.lookupRepository
      .createQueryBuilder('lookup')
      .select([
        'lookup.LookUpId as lookUpId',
        'lookup.LookUpTableName as lookUpTableName',
        'lookup.LookUpCode as lookUpCode',
        'lookup.LookUpName as lookUpName',
        'lookup.Param1 as param1',
        'lookup.Param2 as param2',
        'lookup.Param3 as param3',
        'lookup.LookUpStatus as lookUpStatusId',
        'lookup.LookUpTypeId as lookUpTypeId',
        'lookup.LookUpTypeName as lookUpTypeName',
        'lookup.LookUpData as lookUpData',
        'lookup.CreatedById as createdBy',
        'lookup.ModifiedById as modifiedBy',
        'lookup.CreatedDate as createdDate',
        'lookup.UpdatedDate as modifiedDate',
      ]);

    // Apply filters
    if (params.lookUpId !== undefined && params.lookUpId >= 0) {
      query.andWhere('lookup.LookUpId = :lookUpId', { lookUpId: params.lookUpId });
    }

    if (params.lookUpTableName) {
      query.andWhere('lookup.LookUpTableName = :lookUpTableName', {
        lookUpTableName: params.lookUpTableName,
      });
    }

    if (params.lookUpName) {
      query.andWhere('lookup.LookUpName LIKE :lookUpName', {
        lookUpName: `%${params.lookUpName}%`,
      });
    }

    if (params.lookUpCode) {
      query.andWhere('lookup.LookUpCode = :lookUpCode', {
        lookUpCode: params.lookUpCode,
      });
    }

    if (params.param1) {
      query.andWhere('lookup.Param1 = :param1', { param1: params.param1 });
    }

    if (params.param2) {
      query.andWhere('lookup.Param2 = :param2', { param2: params.param2 });
    }

    if (params.param3) {
      query.andWhere('lookup.Param3 = :param3', { param3: params.param3 });
    }

    if (params.lookUpStatusId !== undefined && params.lookUpStatusId >= 0) {
      query.andWhere('lookup.LookUpStatus = :lookUpStatusId', {
        lookUpStatusId: params.lookUpStatusId,
      });
    }

    if (params.lookUpTypeId !== undefined && params.lookUpTypeId >= 0) {
      query.andWhere('lookup.LookUpTypeId = :lookUpTypeId', {
        lookUpTypeId: params.lookUpTypeId,
      });
    }

    query.orderBy('lookup.LookUpName', 'ASC');

    return query;
  }

  /**
   * Map raw database results to response format
   */
  private mapLookupsResponse(lookups: any[]): any[] {
    return lookups.map(lookup => this.mapLookupResponse(lookup));
  }

  /**
   * Map single lookup to response format
   */
  private mapLookupResponse(lookup: any): any {
    const createdDate = new Date(lookup.createdDate);
    const modifiedDate = new Date(lookup.modifiedDate);

    return {
      lookUpId: lookup.lookUpId,
      lookUpTableName: lookup.lookUpTableName || '',
      lookUpCode: lookup.lookUpCode || '',
      lookUpName: lookup.lookUpName || '',
      param1: lookup.param1 || '',
      param2: lookup.param2 || '',
      param3: lookup.param3 || '',
      lookUpStatusId: lookup.lookUpStatusId || 0,
      lookUpStatusName: this.getLookupStatusName(lookup.lookUpStatusId),
      lookUpTypeId: lookup.lookUpTypeId || 0,
      lookUpTypeName: lookup.lookUpTypeName || '',
      lookUpData: lookup.lookUpData ? JSON.parse(lookup.lookUpData) : null,
      createdBy: lookup.createdBy,
      modifiedBy: lookup.modifiedBy,
      createdDate: createdDate,
      modifiedDate: modifiedDate,
      createdDateStr: this.formatDate(createdDate),
      modifiedDateStr: this.formatDate(modifiedDate),
    };
  }

  /**
   * Get lookup status name
   */
  private getLookupStatusName(statusId: number): string {
    const statusMap: { [key: number]: string } = {
      0: 'Inactive',
      1: 'Active',
      2: 'Deleted',
    };
    return statusMap[statusId] || 'Unknown';
  }

  /**
   * Format date to dd/MM/yyyy
   */
  private formatDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }
}