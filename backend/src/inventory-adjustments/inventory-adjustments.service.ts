import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InventoryAdjustment } from './inventory-adjustment.entity';
import { SaveInventoryAdjustmentDto } from './dto/inventory-adjustments.dto';

export interface GetInventoryAdjustmentsListParams {
  adjustmentId?: number;
  fromAdjustmentDate?: string;
  toAdjustmentDate?: string;
  adjustmentStatusId?: number;
  adjustmentTypeId?: number;
  createdBy?: number;
  modifiedBy?: number;
  fromCreatedDate?: string;
  toCreatedDate?: string;
  fromModifiedDate?: string;
  toModifiedDate?: string;
  itemsPerPage?: number;
  pageNumber?: number;
  includeAdjustmentItems?: boolean;
}

@Injectable()
export class InventoryAdjustmentService {
  constructor(
    @InjectRepository(InventoryAdjustment)
    private readonly inventoryAdjustmentRepository: Repository<InventoryAdjustment>,
  ) {}

  async saveInventoryAdjustmentDetails(
    adjustmentDto: SaveInventoryAdjustmentDto,
  ): Promise<InventoryAdjustment> {
    try {
      const adjustment = this.inventoryAdjustmentRepository.create({
        ...(adjustmentDto.AdjustmentId && { adjustmentId: adjustmentDto.AdjustmentId }),
        adjustmentStatusId: adjustmentDto.adjustmentStatusId,
        adjustmentTypeId: adjustmentDto.adjustmentTypeId,
        description: adjustmentDto.Description,
        createdBy: adjustmentDto.createdBy,
        modifiedBy: adjustmentDto.modifiedBy,
      });

      return await this.inventoryAdjustmentRepository.save(adjustment);
    } catch (error) {
      throw new Error(`Failed to save inventory adjustment: ${error.message}`);
    }
  }

  async getInventoryAdjustmentsList(
    params: GetInventoryAdjustmentsListParams,
  ): Promise<InventoryAdjustment[]> {
    try {
      const query = this.inventoryAdjustmentRepository.createQueryBuilder('adjustment');

      if (params.adjustmentId) {
        query.andWhere('adjustment.adjustmentId = :adjustmentId', {
          adjustmentId: params.adjustmentId,
        });
      }

      if (params.fromAdjustmentDate) {
        query.andWhere('adjustment.adjustmentDate >= :fromAdjustmentDate', {
          fromAdjustmentDate: params.fromAdjustmentDate,
        });
      }

      if (params.toAdjustmentDate) {
        query.andWhere('adjustment.adjustmentDate <= :toAdjustmentDate', {
          toAdjustmentDate: params.toAdjustmentDate,
        });
      }

      if (params.adjustmentStatusId) {
        query.andWhere('adjustment.adjustmentStatusId = :adjustmentStatusId', {
          adjustmentStatusId: params.adjustmentStatusId,
        });
      }

      if (params.adjustmentTypeId) {
        query.andWhere('adjustment.adjustmentTypeId = :adjustmentTypeId', {
          adjustmentTypeId: params.adjustmentTypeId,
        });
      }

      if (params.createdBy) {
        query.andWhere('adjustment.createdBy = :createdBy', {
          createdBy: params.createdBy,
        });
      }

      if (params.modifiedBy) {
        query.andWhere('adjustment.modifiedBy = :modifiedBy', {
          modifiedBy: params.modifiedBy,
        });
      }

      if (params.fromCreatedDate) {
        query.andWhere('adjustment.createdDate >= :fromCreatedDate', {
          fromCreatedDate: params.fromCreatedDate,
        });
      }

      if (params.toCreatedDate) {
        query.andWhere('adjustment.createdDate <= :toCreatedDate', {
          toCreatedDate: params.toCreatedDate,
        });
      }

      if (params.fromModifiedDate) {
        query.andWhere('adjustment.modifiedDate >= :fromModifiedDate', {
          fromModifiedDate: params.fromModifiedDate,
        });
      }

      if (params.toModifiedDate) {
        query.andWhere('adjustment.modifiedDate <= :toModifiedDate', {
          toModifiedDate: params.toModifiedDate,
        });
      }

      if (params.includeAdjustmentItems) {
        query.leftJoinAndSelect('adjustment.adjustmentItems', 'items');
      }

      if (params.itemsPerPage && params.pageNumber) {
        const skip = (params.pageNumber - 1) * params.itemsPerPage;
        query.skip(skip).take(params.itemsPerPage);
      }

      query.orderBy('adjustment.adjustmentId', 'DESC');

      return await query.getMany();
    } catch (error) {
      throw new Error(`Failed to get inventory adjustments list: ${error.message}`);
    }
  }

  async getInventoryAdjustmentDetails(
    adjustmentId: number,
    includeAdjustmentItems: boolean = false,
  ): Promise<InventoryAdjustment | null> {
    try {
      const query = this.inventoryAdjustmentRepository
        .createQueryBuilder('adjustment')
        .where('adjustment.adjustmentId = :adjustmentId', { adjustmentId });

      if (includeAdjustmentItems) {
        query.leftJoinAndSelect('adjustment.adjustmentItems', 'items');
      }

      return await query.getOne();
    } catch (error) {
      throw new Error(`Failed to get inventory adjustment details: ${error.message}`);
    }
  }

  async deleteInventoryAdjustment(adjustmentId: number): Promise<void> {
    try {
      await this.inventoryAdjustmentRepository.delete(adjustmentId);
    } catch (error) {
      throw new Error(`Failed to delete inventory adjustment: ${error.message}`);
    }
  }

  async getMaxInventoryAdjustmentsId(): Promise<number> {
    try {
      const result = await this.inventoryAdjustmentRepository
        .createQueryBuilder('adjustment')
        .select('MAX(adjustment.adjustmentId)', 'maxId')
        .getRawOne();

      return result?.maxId || 0;
    } catch (error) {
      throw new Error(`Failed to get max inventory adjustment ID: ${error.message}`);
    }
  }
}