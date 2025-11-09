import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Agent } from './agent.entity';
import { StringUtils } from 'src/shared/utils/string.utils';

export interface AgentSearchParams {
  customerIds?: string;
  customerParentId?: number;
  customerStatusIds?: string;
  customerTypeIds?: string;
  customerIdz?: string;
  customerName?: string;
  customerPhoneNumber?: string;
  customerMobileNumber?: string;
  customerFaxNumber?: string;
  customerCity?: string;
  customerCountry?: string;
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
export class AgentsService {
  constructor(
    @InjectRepository(Agent)
    private agentRepository: Repository<Agent>,
  ) {}

  async saveAgentDetails(agentData: Partial<Agent>): Promise<Agent> {
    try {
      // If customerId exists, update existing agent
      if (agentData.customerId) {
        const existingAgent = await this.agentRepository.findOne({
          where: { customerId: agentData.customerId },
        });

        if (existingAgent) {
          Object.assign(existingAgent, agentData);
          return await this.agentRepository.save(existingAgent);
        }
      }

      // Create new agent
      const newAgent = this.agentRepository.create(agentData);
      return await this.agentRepository.save(newAgent);
    } catch (error) {
      throw new Error(`Failed to save agent: ${error.message}`);
    }
  }

  async getAgentsList(params: AgentSearchParams): Promise<Agent[]> {
    try {
      const queryBuilder = this.agentRepository.createQueryBuilder('agent');

      // Apply filters
      this.applyFilters(queryBuilder, params);

      // Apply pagination
      if (params.itemsPerPage && params.pageNumber) {
        const skip = (params.pageNumber - 1) * params.itemsPerPage;
        queryBuilder.skip(skip).take(params.itemsPerPage);
      }

      // Order by created date descending
      queryBuilder.orderBy('agent.createdDate', 'DESC');

      return await queryBuilder.getMany();
    } catch (error) {
      throw new Error(`Failed to get agents list: ${error.message}`);
    }
  }

  async getAgentDetails(customerId: number): Promise<Agent | null> {
    try {
      return await this.agentRepository.findOne({
        where: { customerId },
      });
    } catch (error) {
      throw new Error(`Failed to get agent details: ${error.message}`);
    }
  }

  async deleteAgent(customerId: number): Promise<void> {
    try {
      await this.agentRepository.delete({ customerId });
    } catch (error) {
      throw new Error(`Failed to delete agent: ${error.message}`);
    }
  }

  private applyFilters(
    queryBuilder: SelectQueryBuilder<Agent>,
    params: AgentSearchParams,
  ): void {
    // Filter by customer IDs
    if (params.customerIds && !StringUtils.isNullOrEmpty(params.customerIds)) {
      const ids = StringUtils.toIntArray(params.customerIds);
      if (ids.length > 0) {
        queryBuilder.andWhere('agent.customerId IN (:...customerIds)', { customerIds: ids });
      }
    }

    // Filter by parent ID
    if (params.customerParentId && params.customerParentId > 0) {
      queryBuilder.andWhere('agent.customerParentId = :customerParentId', {
        customerParentId: params.customerParentId,
      });
    }

    // Filter by status IDs
    if (params.customerStatusIds && !StringUtils.isNullOrEmpty(params.customerStatusIds)) {
      const statusIds = StringUtils.toIntArray(params.customerStatusIds);
      if (statusIds.length > 0) {
        queryBuilder.andWhere('agent.customerStatusId IN (:...statusIds)', { statusIds });
      }
    }

    // Filter by type IDs
    if (params.customerTypeIds && !StringUtils.isNullOrEmpty(params.customerTypeIds)) {
      const typeIds = StringUtils.toIntArray(params.customerTypeIds);
      if (typeIds.length > 0) {
        queryBuilder.andWhere('agent.customerTypeId IN (:...typeIds)', { typeIds });
      }
    }

    // Filter by customer IDZ
    if (params.customerIdz && !StringUtils.isNullOrEmpty(params.customerIdz)) {
      queryBuilder.andWhere('agent.customerIdz LIKE :customerIdz', {
        customerIdz: `%${params.customerIdz}%`,
      });
    }

    // Filter by customer name
    if (params.customerName && !StringUtils.isNullOrEmpty(params.customerName)) {
      queryBuilder.andWhere('agent.customerName LIKE :customerName', {
        customerName: `%${params.customerName}%`,
      });
    }

    // Filter by phone number
    if (params.customerPhoneNumber && !StringUtils.isNullOrEmpty(params.customerPhoneNumber)) {
      queryBuilder.andWhere('agent.customerPhoneNumber LIKE :phoneNumber', {
        phoneNumber: `%${params.customerPhoneNumber}%`,
      });
    }

    // Filter by mobile number
    if (params.customerMobileNumber && !StringUtils.isNullOrEmpty(params.customerMobileNumber)) {
      queryBuilder.andWhere('agent.customerMobileNumber LIKE :mobileNumber', {
        mobileNumber: `%${params.customerMobileNumber}%`,
      });
    }

    // Filter by fax number
    if (params.customerFaxNumber && !StringUtils.isNullOrEmpty(params.customerFaxNumber)) {
      queryBuilder.andWhere('agent.customerFaxNumber LIKE :faxNumber', {
        faxNumber: `%${params.customerFaxNumber}%`,
      });
    }

    // Filter by city
    if (params.customerCity && !StringUtils.isNullOrEmpty(params.customerCity)) {
      queryBuilder.andWhere('agent.customerCity LIKE :city', {
        city: `%${params.customerCity}%`,
      });
    }

    // Filter by country
    if (params.customerCountry && !StringUtils.isNullOrEmpty(params.customerCountry)) {
      queryBuilder.andWhere('agent.customerCountry LIKE :country', {
        country: `%${params.customerCountry}%`,
      });
    }

    // Filter by created by IDs
    if (params.createdByIds && !StringUtils.isNullOrEmpty(params.createdByIds)) {
      const createdByIds = StringUtils.toIntArray(params.createdByIds);
      if (createdByIds.length > 0) {
        queryBuilder.andWhere('agent.createdBy IN (:...createdByIds)', { createdByIds });
      }
    }

    // Filter by modified by IDs
    if (params.modifiedByIds && !StringUtils.isNullOrEmpty(params.modifiedByIds)) {
      const modifiedByIds = StringUtils.toIntArray(params.modifiedByIds);
      if (modifiedByIds.length > 0) {
        queryBuilder.andWhere('agent.modifiedBy IN (:...modifiedByIds)', { modifiedByIds });
      }
    }

    // Filter by created date range
    if (params.fromCreatedDate && !StringUtils.isNullOrEmpty(params.fromCreatedDate)) {
      queryBuilder.andWhere('agent.createdDate >= :fromCreatedDate', {
        fromCreatedDate: params.fromCreatedDate,
      });
    }
    if (params.toCreatedDate && !StringUtils.isNullOrEmpty(params.toCreatedDate)) {
      queryBuilder.andWhere('agent.createdDate <= :toCreatedDate', {
        toCreatedDate: params.toCreatedDate,
      });
    }

    // Filter by modified date range
    if (params.fromModifiedDate && !StringUtils.isNullOrEmpty(params.fromModifiedDate)) {
      queryBuilder.andWhere('agent.modifiedDate >= :fromModifiedDate', {
        fromModifiedDate: params.fromModifiedDate,
      });
    }
    if (params.toModifiedDate && !StringUtils.isNullOrEmpty(params.toModifiedDate)) {
      queryBuilder.andWhere('agent.modifiedDate <= :toModifiedDate', {
        toModifiedDate: params.toModifiedDate,
      });
    }
  }
}