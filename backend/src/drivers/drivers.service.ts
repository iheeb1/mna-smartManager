import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Driver } from './driver.entity';
import { StringUtils } from 'src/shared/utils/string.utils';

export interface DriverSearchParams {
  driverIds?: string;
  driverParentIds?: string;
  driverStatusIds?: string;
  driverTypeIds?: string;
  driverIdz?: string;
  carNumber?: string;
  driverName?: string;
  driverPhoneNumber?: string;
  driverMobileNumber?: string;
  driverFaxNumber?: string;
  driverCity?: string;
  driverCountry?: string;
  createdByIds?: string;
  modifiedByIds?: string;
  fromCreatedDate?: string;
  toCreatedDate?: string;
  fromModifiedDate?: string;
  toModifiedDate?: string;
  itemsPerPage?: number;
  pageNumber?: number;
}

@Injectable()
export class DriversService {
  constructor(
    @InjectRepository(Driver)
    private driverRepository: Repository<Driver>,
  ) {}

  async saveDriverDetails(driverData: Partial<Driver>): Promise<Driver> {
    try {
      // If driverId exists, update existing driver
      if (driverData.driverId) {
        const existingDriver = await this.driverRepository.findOne({
          where: { driverId: driverData.driverId },
        });

        if (existingDriver) {
          Object.assign(existingDriver, driverData);
          return await this.driverRepository.save(existingDriver);
        }
      }

      // Create new driver
      const newDriver = this.driverRepository.create(driverData);
      return await this.driverRepository.save(newDriver);
    } catch (error) {
      throw new Error(`Failed to save driver: ${error.message}`);
    }
  }

  async getDriversList(params: DriverSearchParams): Promise<Driver[]> {
    try {
      const queryBuilder = this.driverRepository.createQueryBuilder('driver');

      // Apply filters
      this.applyFilters(queryBuilder, params);

      // Apply pagination
      if (params.itemsPerPage && params.pageNumber) {
        const skip = (params.pageNumber - 1) * params.itemsPerPage;
        queryBuilder.skip(skip).take(params.itemsPerPage);
      }

      // Order by created date descending
      queryBuilder.orderBy('driver.createdDate', 'DESC');

      return await queryBuilder.getMany();
    } catch (error) {
      throw new Error(`Failed to get drivers list: ${error.message}`);
    }
  }

  async getDriversTotalRowsCount(params: DriverSearchParams): Promise<number> {
    try {
      const queryBuilder = this.driverRepository.createQueryBuilder('driver');

      // Apply same filters as getDriversList
      this.applyFilters(queryBuilder, params);

      return await queryBuilder.getCount();
    } catch (error) {
      throw new Error(`Failed to get drivers count: ${error.message}`);
    }
  }

  async getDriverDetails(driverId: number): Promise<Driver | null> {
    try {
      return await this.driverRepository.findOne({
        where: { driverId },
      });
    } catch (error) {
      throw new Error(`Failed to get driver details: ${error.message}`);
    }
  }

  async deleteDriver(driverId: number): Promise<void> {
    try {
      await this.driverRepository.delete({ driverId });
    } catch (error) {
      throw new Error(`Failed to delete driver: ${error.message}`);
    }
  }

  private applyFilters(
    queryBuilder: SelectQueryBuilder<Driver>,
    params: DriverSearchParams,
  ): void {
    // Filter by driver IDs
    if (params.driverIds && !StringUtils.isNullOrEmpty(params.driverIds)) {
      const ids = StringUtils.toIntArray(params.driverIds);
      if (ids.length > 0) {
        queryBuilder.andWhere('driver.driverId IN (:...driverIds)', { driverIds: ids });
      }
    }

    // Filter by parent IDs
    if (params.driverParentIds && !StringUtils.isNullOrEmpty(params.driverParentIds)) {
      const parentIds = StringUtils.toIntArray(params.driverParentIds);
      if (parentIds.length > 0) {
        queryBuilder.andWhere('driver.driverParentId IN (:...parentIds)', { parentIds });
      }
    }

    // Filter by status IDs
    if (params.driverStatusIds && !StringUtils.isNullOrEmpty(params.driverStatusIds)) {
      const statusIds = StringUtils.toIntArray(params.driverStatusIds);
      if (statusIds.length > 0) {
        queryBuilder.andWhere('driver.driverStatusId IN (:...statusIds)', { statusIds });
      }
    }

    // Filter by type IDs
    if (params.driverTypeIds && !StringUtils.isNullOrEmpty(params.driverTypeIds)) {
      const typeIds = StringUtils.toIntArray(params.driverTypeIds);
      if (typeIds.length > 0) {
        queryBuilder.andWhere('driver.driverTypeId IN (:...typeIds)', { typeIds });
      }
    }

    // Filter by driver IDZ
    if (params.driverIdz && !StringUtils.isNullOrEmpty(params.driverIdz)) {
      queryBuilder.andWhere('driver.driverIdz LIKE :driverIdz', {
        driverIdz: `%${params.driverIdz}%`,
      });
    }

    // Filter by car number
    if (params.carNumber && !StringUtils.isNullOrEmpty(params.carNumber)) {
      queryBuilder.andWhere('driver.carNumber LIKE :carNumber', {
        carNumber: `%${params.carNumber}%`,
      });
    }

    // Filter by driver name
    if (params.driverName && !StringUtils.isNullOrEmpty(params.driverName)) {
      queryBuilder.andWhere('driver.driverName LIKE :driverName', {
        driverName: `%${params.driverName}%`,
      });
    }

    // Filter by phone number
    if (params.driverPhoneNumber && !StringUtils.isNullOrEmpty(params.driverPhoneNumber)) {
      queryBuilder.andWhere('driver.driverPhoneNumber LIKE :phoneNumber', {
        phoneNumber: `%${params.driverPhoneNumber}%`,
      });
    }

    // Filter by mobile number
    if (params.driverMobileNumber && !StringUtils.isNullOrEmpty(params.driverMobileNumber)) {
      queryBuilder.andWhere('driver.driverMobileNumber LIKE :mobileNumber', {
        mobileNumber: `%${params.driverMobileNumber}%`,
      });
    }

    // Filter by fax number
    if (params.driverFaxNumber && !StringUtils.isNullOrEmpty(params.driverFaxNumber)) {
      queryBuilder.andWhere('driver.driverFaxNumber LIKE :faxNumber', {
        faxNumber: `%${params.driverFaxNumber}%`,
      });
    }

    // Filter by city
    if (params.driverCity && !StringUtils.isNullOrEmpty(params.driverCity)) {
      queryBuilder.andWhere('driver.driverCity LIKE :city', {
        city: `%${params.driverCity}%`,
      });
    }

    // Filter by country
    if (params.driverCountry && !StringUtils.isNullOrEmpty(params.driverCountry)) {
      queryBuilder.andWhere('driver.driverCountry LIKE :country', {
        country: `%${params.driverCountry}%`,
      });
    }

    // Filter by created by IDs
    if (params.createdByIds && !StringUtils.isNullOrEmpty(params.createdByIds)) {
      const createdByIds = StringUtils.toIntArray(params.createdByIds);
      if (createdByIds.length > 0) {
        queryBuilder.andWhere('driver.createdBy IN (:...createdByIds)', { createdByIds });
      }
    }

    // Filter by modified by IDs
    if (params.modifiedByIds && !StringUtils.isNullOrEmpty(params.modifiedByIds)) {
      const modifiedByIds = StringUtils.toIntArray(params.modifiedByIds);
      if (modifiedByIds.length > 0) {
        queryBuilder.andWhere('driver.modifiedBy IN (:...modifiedByIds)', { modifiedByIds });
      }
    }

    // Filter by created date range
    if (params.fromCreatedDate && !StringUtils.isNullOrEmpty(params.fromCreatedDate)) {
      queryBuilder.andWhere('driver.createdDate >= :fromCreatedDate', {
        fromCreatedDate: params.fromCreatedDate,
      });
    }
    if (params.toCreatedDate && !StringUtils.isNullOrEmpty(params.toCreatedDate)) {
      queryBuilder.andWhere('driver.createdDate <= :toCreatedDate', {
        toCreatedDate: params.toCreatedDate,
      });
    }

    // Filter by modified date range
    if (params.fromModifiedDate && !StringUtils.isNullOrEmpty(params.fromModifiedDate)) {
      queryBuilder.andWhere('driver.modifiedDate >= :fromModifiedDate', {
        fromModifiedDate: params.fromModifiedDate,
      });
    }
    if (params.toModifiedDate && !StringUtils.isNullOrEmpty(params.toModifiedDate)) {
      queryBuilder.andWhere('driver.modifiedDate <= :toModifiedDate', {
        toModifiedDate: params.toModifiedDate,
      });
    }
  }
}