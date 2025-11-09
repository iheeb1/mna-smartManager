import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QuoteItem } from './quote-item.entity';
import { StringUtils } from 'src/shared/utils/string.utils';

export interface GetQuoteItemsListParams {
  orderItemIds?: string;
  orderIds?: string;
  customerIds?: string;
  customerIdz?: string;
  customerName?: string;
  carIds?: string;
  carCarNumber?: string;
  orderTypeIds?: string;
  fromOrderDate?: string;
  toOrderDate?: string;
  orderStatusIds?: string;
  shippingCertificateId?: string;
  fromLocationIds?: string;
  toLocationIds?: string;
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
export class QuoteItemsService {
  constructor(
    @InjectRepository(QuoteItem)
    private readonly quoteItemRepository: Repository<QuoteItem>,
  ) {}

  async saveQuoteItemDetails(quoteItemDto: any): Promise<QuoteItem> {
    try {
      const quoteItemData = {
        ...(quoteItemDto.OrderItemId && { orderItemId: Number(quoteItemDto.OrderItemId) }),
        orderId: quoteItemDto.OrderId || quoteItemDto.orderId,
        orderTypeId: quoteItemDto.OrderTypeId || quoteItemDto.orderTypeId,
        orderUnitsNumber: quoteItemDto.OrderUnitsNumber || quoteItemDto.orderUnitsNumber,
        orderPrice: quoteItemDto.OrderPrice || quoteItemDto.orderPrice,
        orderVat: quoteItemDto.OrderVat || quoteItemDto.orderVat,
        orderIncludeVat: quoteItemDto.OrderIncludeVat || quoteItemDto.orderIncludeVat,
        orderTotalPriceWithOutVat: quoteItemDto.OrderTotalPriceWithOutVat || quoteItemDto.orderTotalPriceWithOutVat,
        orderTotalPriceVat: quoteItemDto.OrderTotalPriceVat || quoteItemDto.orderTotalPriceVat,
        orderTotalPriceWithVat: quoteItemDto.OrderTotalPriceWithVat || quoteItemDto.orderTotalPriceWithVat,
        orderStatusId: quoteItemDto.OrderStatusId || quoteItemDto.orderStatusId,
        shippingCertificateId: quoteItemDto.ShippingCertificateId || quoteItemDto.shippingCertificateId,
        fromLocationId: quoteItemDto.FromLocationId || quoteItemDto.fromLocationId,
        toLocationId: quoteItemDto.ToLocationId || quoteItemDto.toLocationId,
        orderNotes: quoteItemDto.OrderNotes || quoteItemDto.orderNotes,
        orderDate: quoteItemDto.OrderDate || quoteItemDto.orderDate,
        createdBy: quoteItemDto.CreatedBy || quoteItemDto.createdBy,
        modifiedBy: quoteItemDto.ModifiedBy || quoteItemDto.modifiedBy,
      };

      const quoteItem = this.quoteItemRepository.create(quoteItemData);
      return await this.quoteItemRepository.save(quoteItem) as unknown as QuoteItem;
    } catch (error) {
      throw new Error(`Failed to save quote item: ${error.message}`);
    }
  }

  async getQuoteItemsList(params: GetQuoteItemsListParams): Promise<QuoteItem[]> {
    try {
      const query = this.quoteItemRepository.createQueryBuilder('quoteItem');

      if (params.orderItemIds) {
        const ids = StringUtils.toIntArray(params.orderItemIds);
        if (ids.length > 0) {
          query.andWhere('quoteItem.orderItemId IN (:...orderItemIds)', { orderItemIds: ids });
        }
      }

      if (params.orderIds) {
        const ids = StringUtils.toIntArray(params.orderIds);
        if (ids.length > 0) {
          query.andWhere('quoteItem.orderId IN (:...orderIds)', { orderIds: ids });
        }
      }

      if (params.orderTypeIds) {
        const ids = StringUtils.toIntArray(params.orderTypeIds);
        if (ids.length > 0) {
          query.andWhere('quoteItem.orderTypeId IN (:...orderTypeIds)', { orderTypeIds: ids });
        }
      }

      if (params.orderStatusIds) {
        const ids = StringUtils.toIntArray(params.orderStatusIds);
        if (ids.length > 0) {
          query.andWhere('quoteItem.orderStatusId IN (:...orderStatusIds)', { orderStatusIds: ids });
        }
      }

      if (params.shippingCertificateId) {
        query.andWhere('quoteItem.shippingCertificateId LIKE :shippingCertificateId', {
          shippingCertificateId: `%${params.shippingCertificateId}%`,
        });
      }

      if (params.fromLocationIds) {
        const ids = StringUtils.toIntArray(params.fromLocationIds);
        if (ids.length > 0) {
          query.andWhere('quoteItem.fromLocationId IN (:...fromLocationIds)', { fromLocationIds: ids });
        }
      }

      if (params.toLocationIds) {
        const ids = StringUtils.toIntArray(params.toLocationIds);
        if (ids.length > 0) {
          query.andWhere('quoteItem.toLocationId IN (:...toLocationIds)', { toLocationIds: ids });
        }
      }

      if (params.fromOrderDate) {
        query.andWhere('quoteItem.orderDate >= :fromOrderDate', {
          fromOrderDate: params.fromOrderDate,
        });
      }

      if (params.toOrderDate) {
        query.andWhere('quoteItem.orderDate <= :toOrderDate', {
          toOrderDate: params.toOrderDate,
        });
      }

      if (params.createdByIds) {
        const ids = StringUtils.toIntArray(params.createdByIds);
        if (ids.length > 0) {
          query.andWhere('quoteItem.createdBy IN (:...createdByIds)', { createdByIds: ids });
        }
      }

      if (params.modifiedByIds) {
        const ids = StringUtils.toIntArray(params.modifiedByIds);
        if (ids.length > 0) {
          query.andWhere('quoteItem.modifiedBy IN (:...modifiedByIds)', { modifiedByIds: ids });
        }
      }

      if (params.fromCreatedDate) {
        query.andWhere('quoteItem.createdDate >= :fromCreatedDate', {
          fromCreatedDate: params.fromCreatedDate,
        });
      }

      if (params.toCreatedDate) {
        query.andWhere('quoteItem.createdDate <= :toCreatedDate', {
          toCreatedDate: params.toCreatedDate,
        });
      }

      if (params.fromModifiedDate) {
        query.andWhere('quoteItem.modifiedDate >= :fromModifiedDate', {
          fromModifiedDate: params.fromModifiedDate,
        });
      }

      if (params.toModifiedDate) {
        query.andWhere('quoteItem.modifiedDate <= :toModifiedDate', {
          toModifiedDate: params.toModifiedDate,
        });
      }

      if (params.itemsPerPage && params.pageNumber) {
        const skip = (params.pageNumber - 1) * params.itemsPerPage;
        query.skip(skip).take(params.itemsPerPage);
      }

      query.orderBy('quoteItem.orderItemId', 'DESC');

      return await query.getMany();
    } catch (error) {
      throw new Error(`Failed to get quote items list: ${error.message}`);
    }
  }

  async getQuoteItemDetails(orderItemId: number): Promise<QuoteItem | null> {
    try {
      return await this.quoteItemRepository.findOne({
        where: { orderItemId },
        relations: ['quote'],
      });
    } catch (error) {
      throw new Error(`Failed to get quote item details: ${error.message}`);
    }
  }

  async deleteQuoteItem(orderItemId: number): Promise<void> {
    try {
      await this.quoteItemRepository.delete(orderItemId);
    } catch (error) {
      throw new Error(`Failed to delete quote item: ${error.message}`);
    }
  }
}