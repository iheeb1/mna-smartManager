import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Transportation } from './transportation.entity';
import { StringUtils } from 'src/shared/utils/string.utils';

export interface GetTransportationsListParams {
  transportationIds?: string;
  driverIds?: string;
  driverName?: string;
  driverCarNumber?: string;
  fromTransportationDate?: string;
  toTransportationDate?: string;
  transportationStatusIds?: string;
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
export class TransportationsService {
  constructor(
    @InjectRepository(Transportation)
    private readonly transportationRepository: Repository<Transportation>,
  ) {}

  async saveTransportationDetails(transportationDto: any): Promise<Transportation> {
    try {
      const transportationData = {
        ...(transportationDto.TransportationId && { transportationId: Number(transportationDto.TransportationId) }),
        driverId: transportationDto.DriverId || transportationDto.driverId,
        transportationStatusId: transportationDto.TransportationStatusId || transportationDto.transportationStatusId,
        transportationNotes: transportationDto.TransportationNotes || transportationDto.transportationNotes,
        transportationDate: transportationDto.TransportationDate || transportationDto.transportationDate,
        createdBy: transportationDto.CreatedBy || transportationDto.createdBy,
        modifiedBy: transportationDto.ModifiedBy || transportationDto.modifiedBy,
      };

      const transportation = this.transportationRepository.create(transportationData);
      return await this.transportationRepository.save(transportation) as unknown as Transportation;
    } catch (error) {
      throw new Error(`Failed to save transportation: ${error.message}`);
    }
  }

  async getTransportationsList(params: GetTransportationsListParams): Promise<Transportation[]> {
    try {
      const query = this.transportationRepository.createQueryBuilder('transportation');

      if (params.transportationIds) {
        const ids = StringUtils.toIntArray(params.transportationIds);
        if (ids.length > 0) {
          query.andWhere('transportation.transportationId IN (:...transportationIds)', { transportationIds: ids });
        }
      }

      if (params.driverIds) {
        const ids = StringUtils.toIntArray(params.driverIds);
        if (ids.length > 0) {
          query.andWhere('transportation.driverId IN (:...driverIds)', { driverIds: ids });
        }
      }

      if (params.transportationStatusIds) {
        const ids = StringUtils.toIntArray(params.transportationStatusIds);
        if (ids.length > 0) {
          query.andWhere('transportation.transportationStatusId IN (:...transportationStatusIds)', { transportationStatusIds: ids });
        }
      }

      if (params.fromTransportationDate) {
        query.andWhere('transportation.transportationDate >= :fromTransportationDate', {
          fromTransportationDate: params.fromTransportationDate,
        });
      }

      if (params.toTransportationDate) {
        query.andWhere('transportation.transportationDate <= :toTransportationDate', {
          toTransportationDate: params.toTransportationDate,
        });
      }

      if (params.createdByIds) {
        const ids = StringUtils.toIntArray(params.createdByIds);
        if (ids.length > 0) {
          query.andWhere('transportation.createdBy IN (:...createdByIds)', { createdByIds: ids });
        }
      }

      if (params.modifiedByIds) {
        const ids = StringUtils.toIntArray(params.modifiedByIds);
        if (ids.length > 0) {
          query.andWhere('transportation.modifiedBy IN (:...modifiedByIds)', { modifiedByIds: ids });
        }
      }

      if (params.fromCreatedDate) {
        query.andWhere('transportation.createdDate >= :fromCreatedDate', {
          fromCreatedDate: params.fromCreatedDate,
        });
      }

      if (params.toCreatedDate) {
        query.andWhere('transportation.createdDate <= :toCreatedDate', {
          toCreatedDate: params.toCreatedDate,
        });
      }

      if (params.fromModifiedDate) {
        query.andWhere('transportation.modifiedDate >= :fromModifiedDate', {
          fromModifiedDate: params.fromModifiedDate,
        });
      }

      if (params.toModifiedDate) {
        query.andWhere('transportation.modifiedDate <= :toModifiedDate', {
          toModifiedDate: params.toModifiedDate,
        });
      }

      if (params.itemsPerPage && params.pageNumber) {
        const skip = (params.pageNumber - 1) * params.itemsPerPage;
        query.skip(skip).take(params.itemsPerPage);
      }

      query.orderBy('transportation.transportationId', 'DESC');

      return await query.getMany();
    } catch (error) {
      throw new Error(`Failed to get transportations list: ${error.message}`);
    }
  }

  async getTransportationDetails(transportationId: number, includeTransportationItems: boolean = false): Promise<Transportation | null> {
    try {
      const query = this.transportationRepository
        .createQueryBuilder('transportation')
        .where('transportation.transportationId = :transportationId', { transportationId });

      if (includeTransportationItems) {
        query.leftJoinAndSelect('transportation.transportationItems', 'items');
      }

      return await query.getOne();
    } catch (error) {
      throw new Error(`Failed to get transportation details: ${error.message}`);
    }
  }

  async deleteTransportation(transportationId: number): Promise<void> {
    try {
      await this.transportationRepository.delete(transportationId);
    } catch (error) {
      throw new Error(`Failed to delete transportation: ${error.message}`);
    }
  }

  async deleteTransportations(transportationIds: string): Promise<void> {
    try {
      const ids = StringUtils.toIntArray(transportationIds);
      if (ids.length > 0) {
        await this.transportationRepository.delete(ids);
      }
    } catch (error) {
      throw new Error(`Failed to delete transportations: ${error.message}`);
    }
  }

  async changeTransportationsStatus(transportationIds: string, statusId: number): Promise<void> {
    try {
      const ids = StringUtils.toIntArray(transportationIds);
      if (ids.length > 0) {
        await this.transportationRepository.update(
          { transportationId: In(ids) },
          { transportationStatusId: statusId },
        );
      }
    } catch (error) {
      throw new Error(`Failed to change transportations status: ${error.message}`);
    }
  }
}