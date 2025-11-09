import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Quote } from './quote.entity';
import { StringUtils } from 'src/shared/utils/string.utils';

export interface GetQuotesListParams {
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
export class QuotesService {
  constructor(
    @InjectRepository(Quote)
    private readonly quoteRepository: Repository<Quote>,
  ) {}

  async saveQuoteDetails(quoteDto: any): Promise<Quote> {
    try {
      const quoteData = {
        ...(quoteDto.OrderId && { orderId: Number(quoteDto.OrderId) }),
        customerId: quoteDto.CustomerId || quoteDto.customerId,
        driverId: quoteDto.DriverId || quoteDto.driverId,
        orderTypeId: quoteDto.OrderTypeId || quoteDto.orderTypeId,
        orderUnitsNumber: quoteDto.OrderUnitsNumber || quoteDto.orderUnitsNumber,
        orderPrice: quoteDto.OrderPrice || quoteDto.orderPrice,
        orderVat: quoteDto.OrderVat || quoteDto.orderVat,
        orderIncludeVat: quoteDto.OrderIncludeVat || quoteDto.orderIncludeVat,
        orderTotalPriceWithOutVat: quoteDto.OrderTotalPriceWithOutVat || quoteDto.orderTotalPriceWithOutVat,
        orderTotalPriceVat: quoteDto.OrderTotalPriceVat || quoteDto.orderTotalPriceVat,
        orderTotalPriceWithVat: quoteDto.OrderTotalPriceWithVat || quoteDto.orderTotalPriceWithVat,
        orderStatusId: quoteDto.OrderStatusId || quoteDto.orderStatusId,
        shippingCertificateId: quoteDto.ShippingCertificateId || quoteDto.shippingCertificateId,
        meters: quoteDto.Meters || quoteDto.meters,
        cubes: quoteDto.Cubes || quoteDto.cubes,
        fromLocationId: quoteDto.FromLocationId || quoteDto.fromLocationId,
        toLocationId: quoteDto.ToLocationId || quoteDto.toLocationId,
        locationAddress: quoteDto.LocationAddress || quoteDto.locationAddress,
        orderNotes: quoteDto.OrderNotes || quoteDto.orderNotes,
        orderDate: quoteDto.OrderDate || quoteDto.orderDate,
        evacuationTime: quoteDto.EvacuationTime || quoteDto.evacuationTime,
        conversionDate: quoteDto.ConversionDate || quoteDto.conversionDate,
        createdBy: quoteDto.CreatedBy || quoteDto.createdBy,
        modifiedBy: quoteDto.ModifiedBy || quoteDto.modifiedBy,
      };

      const quote = this.quoteRepository.create(quoteData);
      return await this.quoteRepository.save(quote) as unknown as Quote;
    } catch (error) {
      throw new Error(`Failed to save quote: ${error.message}`);
    }
  }

  async getQuotesList(params: GetQuotesListParams): Promise<Quote[]> {
    try {
      const query = this.quoteRepository.createQueryBuilder('quote');

      if (params.orderIds) {
        const ids = StringUtils.toIntArray(params.orderIds);
        if (ids.length > 0) {
          query.andWhere('quote.orderId IN (:...orderIds)', { orderIds: ids });
        }
      }

      if (params.customerIds) {
        const ids = StringUtils.toIntArray(params.customerIds);
        if (ids.length > 0) {
          query.andWhere('quote.customerId IN (:...customerIds)', { customerIds: ids });
        }
      }

      if (params.orderTypeIds) {
        const ids = StringUtils.toIntArray(params.orderTypeIds);
        if (ids.length > 0) {
          query.andWhere('quote.orderTypeId IN (:...orderTypeIds)', { orderTypeIds: ids });
        }
      }

      if (params.orderStatusIds) {
        const ids = StringUtils.toIntArray(params.orderStatusIds);
        if (ids.length > 0) {
          query.andWhere('quote.orderStatusId IN (:...orderStatusIds)', { orderStatusIds: ids });
        }
      }

      if (params.shippingCertificateId) {
        query.andWhere('quote.shippingCertificateId LIKE :shippingCertificateId', {
          shippingCertificateId: `%${params.shippingCertificateId}%`,
        });
      }

      if (params.fromLocationIds) {
        const ids = StringUtils.toIntArray(params.fromLocationIds);
        if (ids.length > 0) {
          query.andWhere('quote.fromLocationId IN (:...fromLocationIds)', { fromLocationIds: ids });
        }
      }

      if (params.toLocationIds) {
        const ids = StringUtils.toIntArray(params.toLocationIds);
        if (ids.length > 0) {
          query.andWhere('quote.toLocationId IN (:...toLocationIds)', { toLocationIds: ids });
        }
      }

      if (params.fromOrderDate) {
        query.andWhere('quote.orderDate >= :fromOrderDate', {
          fromOrderDate: params.fromOrderDate,
        });
      }

      if (params.toOrderDate) {
        query.andWhere('quote.orderDate <= :toOrderDate', {
          toOrderDate: params.toOrderDate,
        });
      }

      if (params.createdByIds) {
        const ids = StringUtils.toIntArray(params.createdByIds);
        if (ids.length > 0) {
          query.andWhere('quote.createdBy IN (:...createdByIds)', { createdByIds: ids });
        }
      }

      if (params.modifiedByIds) {
        const ids = StringUtils.toIntArray(params.modifiedByIds);
        if (ids.length > 0) {
          query.andWhere('quote.modifiedBy IN (:...modifiedByIds)', { modifiedByIds: ids });
        }
      }

      if (params.fromCreatedDate) {
        query.andWhere('quote.createdDate >= :fromCreatedDate', {
          fromCreatedDate: params.fromCreatedDate,
        });
      }

      if (params.toCreatedDate) {
        query.andWhere('quote.createdDate <= :toCreatedDate', {
          toCreatedDate: params.toCreatedDate,
        });
      }

      if (params.fromModifiedDate) {
        query.andWhere('quote.modifiedDate >= :fromModifiedDate', {
          fromModifiedDate: params.fromModifiedDate,
        });
      }

      if (params.toModifiedDate) {
        query.andWhere('quote.modifiedDate <= :toModifiedDate', {
          toModifiedDate: params.toModifiedDate,
        });
      }

      if (params.itemsPerPage && params.pageNumber) {
        const skip = (params.pageNumber - 1) * params.itemsPerPage;
        query.skip(skip).take(params.itemsPerPage);
      }

      query.orderBy('quote.orderId', 'DESC');

      return await query.getMany();
    } catch (error) {
      throw new Error(`Failed to get quotes list: ${error.message}`);
    }
  }

  async getQuoteDetails(orderId: number, includeQuoteItems: boolean = false): Promise<Quote | null> {
    try {
      const query = this.quoteRepository
        .createQueryBuilder('quote')
        .where('quote.orderId = :orderId', { orderId });

      if (includeQuoteItems) {
        query.leftJoinAndSelect('quote.quoteItems', 'items');
      }

      return await query.getOne();
    } catch (error) {
      throw new Error(`Failed to get quote details: ${error.message}`);
    }
  }

  async deleteQuote(orderId: number): Promise<void> {
    try {
      await this.quoteRepository.delete(orderId);
    } catch (error) {
      throw new Error(`Failed to delete quote: ${error.message}`);
    }
  }

  async deleteQuotes(orderIds: string): Promise<void> {
    try {
      const ids = StringUtils.toIntArray(orderIds);
      if (ids.length > 0) {
        await this.quoteRepository.delete(ids);
      }
    } catch (error) {
      throw new Error(`Failed to delete quotes: ${error.message}`);
    }
  }

  async changeQuotesStatus(orderIds: string, statusId: number): Promise<void> {
    try {
      const ids = StringUtils.toIntArray(orderIds);
      if (ids.length > 0) {
        await this.quoteRepository.update(
          { orderId: In(ids) },
          { orderStatusId: statusId },
        );
      }
    } catch (error) {
      throw new Error(`Failed to change quotes status: ${error.message}`);
    }
  }
}