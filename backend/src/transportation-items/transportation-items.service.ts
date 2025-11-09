import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransportationItem } from './transportation-item.entity';
import { StringUtils } from 'src/shared/utils/string.utils';

export interface GetTransportationItemsListParams {
  transportationItemIds?: string;
  transportationIds?: string;
  shippingCertificateId?: string;
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
export class TransportationItemsService {
  constructor(
    @InjectRepository(TransportationItem)
    private readonly transportationItemRepository: Repository<TransportationItem>,
  ) {}

  async saveTransportationItemDetails(transportationItemDto: any): Promise<TransportationItem> {
    try {
      const transportationItemData = {
        ...(transportationItemDto.TransportationItemId && { transportationItemId: Number(transportationItemDto.TransportationItemId) }),
        transportationId: transportationItemDto.TransportationId || transportationItemDto.transportationId,
        transportationItemStatusId: transportationItemDto.TransportationItemStatusId || transportationItemDto.transportationItemStatusId,
        shippingCertificateId: transportationItemDto.ShippingCertificateId || transportationItemDto.shippingCertificateId,
        transportationItemDesc: transportationItemDto.TransportationItemDesc || transportationItemDto.transportationItemDesc,
        orderUnitsNumber: transportationItemDto.OrderUnitsNumber || transportationItemDto.orderUnitsNumber,
        orderPrice: transportationItemDto.OrderPrice || transportationItemDto.orderPrice,
        orderVat: transportationItemDto.OrderVat || transportationItemDto.orderVat,
        orderIncludeVat: transportationItemDto.OrderIncludeVat || transportationItemDto.orderIncludeVat,
        orderTotalPriceWithOutVat: transportationItemDto.OrderTotalPriceWithOutVat || transportationItemDto.orderTotalPriceWithOutVat,
        orderTotalPriceVat: transportationItemDto.OrderTotalPriceVat || transportationItemDto.orderTotalPriceVat,
        orderTotalPriceWithVat: transportationItemDto.OrderTotalPriceWithVat || transportationItemDto.orderTotalPriceWithVat,
        orderTotalCost: transportationItemDto.OrderTotalCost || transportationItemDto.orderTotalCost,
        orderStatusId: transportationItemDto.OrderStatusId || transportationItemDto.orderStatusId,
        meters: transportationItemDto.Meters || transportationItemDto.meters,
        cubes: transportationItemDto.Cubes || transportationItemDto.cubes,
        fromLocationId: transportationItemDto.FromLocationId || transportationItemDto.fromLocationId,
        toLocationId: transportationItemDto.ToLocationId || transportationItemDto.toLocationId,
        locationAddress: transportationItemDto.LocationAddress || transportationItemDto.locationAddress,
        orderNotes: transportationItemDto.OrderNotes || transportationItemDto.orderNotes,
        orderDate: transportationItemDto.OrderDate || transportationItemDto.orderDate,
        evacuationTime: transportationItemDto.EvacuationTime || transportationItemDto.evacuationTime,
        conversionDate: transportationItemDto.ConversionDate || transportationItemDto.conversionDate,
        createdBy: transportationItemDto.CreatedBy || transportationItemDto.createdBy,
        modifiedBy: transportationItemDto.ModifiedBy || transportationItemDto.modifiedBy,
      };

      const transportationItem = this.transportationItemRepository.create(transportationItemData);
      return await this.transportationItemRepository.save(transportationItem) as unknown as TransportationItem;
    } catch (error) {
      throw new Error(`Failed to save transportation item: ${error.message}`);
    }
  }

  async getTransportationItemsList(params: GetTransportationItemsListParams): Promise<TransportationItem[]> {
    try {
      const query = this.transportationItemRepository.createQueryBuilder('transportationItem');

      if (params.transportationItemIds) {
        const ids = StringUtils.toIntArray(params.transportationItemIds);
        if (ids.length > 0) {
          query.andWhere('transportationItem.transportationItemId IN (:...transportationItemIds)', { transportationItemIds: ids });
        }
      }

      if (params.transportationIds) {
        const ids = StringUtils.toIntArray(params.transportationIds);
        if (ids.length > 0) {
          query.andWhere('transportationItem.transportationId IN (:...transportationIds)', { transportationIds: ids });
        }
      }

      if (params.shippingCertificateId) {
        query.andWhere('transportationItem.shippingCertificateId LIKE :shippingCertificateId', {
          shippingCertificateId: `%${params.shippingCertificateId}%`,
        });
      }

      if (params.transportationStatusIds) {
        const ids = StringUtils.toIntArray(params.transportationStatusIds);
        if (ids.length > 0) {
          query.andWhere('transportationItem.transportationItemStatusId IN (:...transportationStatusIds)', { transportationStatusIds: ids });
        }
      }

      if (params.createdByIds) {
        const ids = StringUtils.toIntArray(params.createdByIds);
        if (ids.length > 0) {
          query.andWhere('transportationItem.createdBy IN (:...createdByIds)', { createdByIds: ids });
        }
      }

      if (params.modifiedByIds) {
        const ids = StringUtils.toIntArray(params.modifiedByIds);
        if (ids.length > 0) {
          query.andWhere('transportationItem.modifiedBy IN (:...modifiedByIds)', { modifiedByIds: ids });
        }
      }

      if (params.fromCreatedDate) {
        query.andWhere('transportationItem.createdDate >= :fromCreatedDate', {
          fromCreatedDate: params.fromCreatedDate,
        });
      }

      if (params.toCreatedDate) {
        query.andWhere('transportationItem.createdDate <= :toCreatedDate', {
          toCreatedDate: params.toCreatedDate,
        });
      }

      if (params.fromModifiedDate) {
        query.andWhere('transportationItem.modifiedDate >= :fromModifiedDate', {
          fromModifiedDate: params.fromModifiedDate,
        });
      }

      if (params.toModifiedDate) {
        query.andWhere('transportationItem.modifiedDate <= :toModifiedDate', {
          toModifiedDate: params.toModifiedDate,
        });
      }

      if (params.itemsPerPage && params.pageNumber) {
        const skip = (params.pageNumber - 1) * params.itemsPerPage;
        query.skip(skip).take(params.itemsPerPage);
      }

      query.orderBy('transportationItem.transportationItemId', 'DESC');

      return await query.getMany();
    } catch (error) {
      throw new Error(`Failed to get transportation items list: ${error.message}`);
    }
  }

  async getTransportationItemDetails(transportationItemId: number): Promise<TransportationItem | null> {
    try {
      return await this.transportationItemRepository.findOne({
        where: { transportationItemId },
        relations: ['transportation'],
      });
    } catch (error) {
      throw new Error(`Failed to get transportation item details: ${error.message}`);
    }
  }

  async deleteTransportationItem(transportationItemId: number): Promise<void> {
    try {
      await this.transportationItemRepository.delete(transportationItemId);
    } catch (error) {
      throw new Error(`Failed to delete transportation item: ${error.message}`);
    }
  }
}