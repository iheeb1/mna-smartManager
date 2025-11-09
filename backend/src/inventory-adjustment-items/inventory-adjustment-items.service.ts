import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { InventoryAdjustmentItem } from './inventory-adjustment-item.entity';
import { StringUtils } from 'src/shared/utils/string.utils';

export interface InventoryAdjustmentItemSearchParams {
  adjustmentItemId?: number;
  adjustmentId?: number;
  productItemId?: number;
  referenceNumber?: string;
  adjustmentItemStatusId?: number;
  adjustmentItemReasonId?: number;
  createdBy?: number;
  modifiedBy?: number;
  fromCreatedDate?: string;
  toCreatedDate?: string;
  fromModifiedDate?: string;
  toModifiedDate?: string;
  itemsPerPage?: number;
  pageNumber?: number;
}

@Injectable()
export class InventoryAdjustmentItemsService {
  constructor(
    @InjectRepository(InventoryAdjustmentItem)
    private adjustmentItemRepository: Repository<InventoryAdjustmentItem>,
  ) {}

  async saveInventoryAdjustmentItemDetails(
    itemData: Partial<InventoryAdjustmentItem>,
  ): Promise<InventoryAdjustmentItem> {
    try {
      // If adjustmentItemId exists, update existing item
      if (itemData.adjustmentItemId) {
        const existingItem = await this.adjustmentItemRepository.findOne({
          where: { adjustmentItemId: itemData.adjustmentItemId },
        });

        if (existingItem) {
          Object.assign(existingItem, itemData);
          return await this.adjustmentItemRepository.save(existingItem);
        }
      }

      // Create new adjustment item
      const newItem = this.adjustmentItemRepository.create(itemData);
      return await this.adjustmentItemRepository.save(newItem);
    } catch (error) {
      throw new Error(`Failed to save inventory adjustment item: ${error.message}`);
    }
  }

  async getInventoryAdjustmentItemsList(
    params: InventoryAdjustmentItemSearchParams,
  ): Promise<InventoryAdjustmentItem[]> {
    try {
      const queryBuilder = this.adjustmentItemRepository.createQueryBuilder('item');

      // Apply filters
      this.applyFilters(queryBuilder, params);

      // Apply pagination
      if (params.itemsPerPage && params.pageNumber) {
        const skip = (params.pageNumber - 1) * params.itemsPerPage;
        queryBuilder.skip(skip).take(params.itemsPerPage);
      }

      // Order by created date descending
      queryBuilder.orderBy('item.createdDate', 'DESC');

      return await queryBuilder.getMany();
    } catch (error) {
      throw new Error(`Failed to get inventory adjustment items list: ${error.message}`);
    }
  }

  async getInventoryAdjustmentItemDetails(
    adjustmentItemId: number,
  ): Promise<InventoryAdjustmentItem | null> {
    try {
      return await this.adjustmentItemRepository.findOne({
        where: { adjustmentItemId },
      });
    } catch (error) {
      throw new Error(`Failed to get inventory adjustment item details: ${error.message}`);
    }
  }

  async deleteInventoryAdjustmentItem(adjustmentItemId: number): Promise<void> {
    try {
      await this.adjustmentItemRepository.delete({ adjustmentItemId });
    } catch (error) {
      throw new Error(`Failed to delete inventory adjustment item: ${error.message}`);
    }
  }

  private applyFilters(
    queryBuilder: SelectQueryBuilder<InventoryAdjustmentItem>,
    params: InventoryAdjustmentItemSearchParams,
  ): void {
    // Filter by adjustment item ID
    if (params.adjustmentItemId && params.adjustmentItemId > 0) {
      queryBuilder.andWhere('item.adjustmentItemId = :adjustmentItemId', {
        adjustmentItemId: params.adjustmentItemId,
      });
    }

    // Filter by adjustment ID
    if (params.adjustmentId && params.adjustmentId > 0) {
      queryBuilder.andWhere('item.adjustmentId = :adjustmentId', {
        adjustmentId: params.adjustmentId,
      });
    }

    // Filter by product item ID
    if (params.productItemId && params.productItemId > 0) {
      queryBuilder.andWhere('item.productItemId = :productItemId', {
        productItemId: params.productItemId,
      });
    }

    // Filter by reference number
    if (params.referenceNumber && !StringUtils.isNullOrEmpty(params.referenceNumber)) {
      queryBuilder.andWhere('item.referenceNumber LIKE :referenceNumber', {
        referenceNumber: `%${params.referenceNumber}%`,
      });
    }

    // Filter by adjustment item status ID
    if (params.adjustmentItemStatusId && params.adjustmentItemStatusId > 0) {
      queryBuilder.andWhere('item.adjustmentItemStatusId = :statusId', {
        statusId: params.adjustmentItemStatusId,
      });
    }

    // Filter by adjustment item reason ID
    if (params.adjustmentItemReasonId && params.adjustmentItemReasonId > 0) {
      queryBuilder.andWhere('item.adjustmentItemReasonId = :reasonId', {
        reasonId: params.adjustmentItemReasonId,
      });
    }

    // Filter by created by
    if (params.createdBy && params.createdBy > 0) {
      queryBuilder.andWhere('item.createdBy = :createdBy', {
        createdBy: params.createdBy,
      });
    }

    // Filter by modified by
    if (params.modifiedBy && params.modifiedBy > 0) {
      queryBuilder.andWhere('item.modifiedBy = :modifiedBy', {
        modifiedBy: params.modifiedBy,
      });
    }

    // Filter by created date range
    if (params.fromCreatedDate && !StringUtils.isNullOrEmpty(params.fromCreatedDate)) {
      queryBuilder.andWhere('item.createdDate >= :fromCreatedDate', {
        fromCreatedDate: params.fromCreatedDate,
      });
    }
    if (params.toCreatedDate && !StringUtils.isNullOrEmpty(params.toCreatedDate)) {
      queryBuilder.andWhere('item.createdDate <= :toCreatedDate', {
        toCreatedDate: params.toCreatedDate,
      });
    }

    // Filter by modified date range
    if (params.fromModifiedDate && !StringUtils.isNullOrEmpty(params.fromModifiedDate)) {
      queryBuilder.andWhere('item.modifiedDate >= :fromModifiedDate', {
        fromModifiedDate: params.fromModifiedDate,
      });
    }
    if (params.toModifiedDate && !StringUtils.isNullOrEmpty(params.toModifiedDate)) {
      queryBuilder.andWhere('item.modifiedDate <= :toModifiedDate', {
        toModifiedDate: params.toModifiedDate,
      });
    }
  }
}