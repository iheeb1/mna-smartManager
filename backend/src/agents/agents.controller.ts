import { Controller, Post, Body, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AgentsService } from './agents.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ApiResponse } from 'src/shared/dto/api-response.dto';
import { StringUtils } from 'src/shared/utils/string.utils';
import { AgentRequestDto, SaveAgentDto, GetAgentsListDto, GetAgentDetailsDto, DeleteAgentDto } from './dto/agents.dto';


@Controller('api/smagent')
@UseGuards(JwtAuthGuard)
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class AgentsController {
  constructor(private readonly agentsService: AgentsService) {}

  @Post()
  async handleRequest(@Body() body: AgentRequestDto): Promise<ApiResponse<any>> {
    try {
      const reqType = StringUtils.toString(body.ReqType);
      const reqObject = body.ReqObject;

      switch (reqType) {
        case 'SaveAgentDetails':
          return await this.saveAgentDetails(reqObject);

        case 'GetAgentsList':
          return await this.getAgentsList(reqObject);

        case 'GetAgentDetails':
          return await this.getAgentDetails(reqObject);

        case 'DeleteAgent':
          return await this.deleteAgent(reqObject);

        default:
          return ApiResponse.error('Invalid request type');
      }
    } catch (error) {
      return ApiResponse.error(error.message);
    }
  }

  private async saveAgentDetails(reqObject: SaveAgentDto): Promise<ApiResponse<any>> {
    if (!reqObject) {
      return ApiResponse.error('Request object is required');
    }

    const agent = await this.agentsService.saveAgentDetails(reqObject);
    
    if (agent) {
      return ApiResponse.success(agent, 'Success');
    }
    
    return ApiResponse.error('Failed to save agent');
  }

  private async getAgentsList(reqObject: GetAgentsListDto): Promise<ApiResponse<any>> {
    if (!reqObject) {
      return ApiResponse.error('Request object is required');
    }

    const searchParams = {
      customerIds: StringUtils.toString(reqObject.CustomerIds),
      customerParentId: StringUtils.toInt(reqObject.CustomerParentId),
      customerStatusIds: StringUtils.toString(reqObject.CustomerStatusIds),
      customerTypeIds: StringUtils.toString(reqObject.CustomerType?.LookUpIds),
      customerIdz: StringUtils.toString(reqObject.CustomerIdz),
      customerName: StringUtils.toString(reqObject.CustomerName),
      customerPhoneNumber: StringUtils.toString(reqObject.CustomerPhoneNumber),
      customerMobileNumber: StringUtils.toString(reqObject.CustomerMobileNumber),
      customerFaxNumber: StringUtils.toString(reqObject.CustomerFaxNumber),
      customerCity: StringUtils.toString(reqObject.CustomerCity),
      customerCountry: StringUtils.toString(reqObject.CustomerCountry),
      createdByIds: StringUtils.toString(reqObject.CreatedBy?.UserIds),
      modifiedByIds: StringUtils.toString(reqObject.ModifiedBy?.UserIds),
      fromCreatedDate: StringUtils.toString(reqObject.CreatedDate?.FromDate),
      toCreatedDate: StringUtils.toString(reqObject.CreatedDate?.ToDate),
      fromModifiedDate: StringUtils.toString(reqObject.ModifiedDate?.FromDate),
      toModifiedDate: StringUtils.toString(reqObject.ModifiedDate?.ToDate),
      itemsPerPage: StringUtils.toInt(reqObject.ItemsPerPage),
      pageNumber: StringUtils.toInt(reqObject.PageNumber),
    };

    const agents = await this.agentsService.getAgentsList(searchParams);
    
    const includeTotalRowsLength = StringUtils.toBoolean(reqObject.IncludeTotalRowsLength);
    const totalRowsLength = includeTotalRowsLength ? agents.length : 0;
    const groupBy = StringUtils.toString(reqObject.GroupBy);

    if (groupBy === 'Name') {
      const grouped = this.groupByName(agents);
      return ApiResponse.success({
        TotalLength: totalRowsLength,
        RowsList: grouped,
      }, 'Success');
    }

    return ApiResponse.success({
      TotalLength: totalRowsLength,
      RowsList: agents,
    }, 'Success');
  }

  private async getAgentDetails(reqObject: GetAgentDetailsDto): Promise<ApiResponse<any>> {
    const customerId = StringUtils.toInt(reqObject.CustomerId);
    
    if (!customerId) {
      return ApiResponse.error('Customer ID is required');
    }

    const agent = await this.agentsService.getAgentDetails(customerId);
    
    if (agent) {
      return ApiResponse.success(agent, 'Success');
    }
    
    return ApiResponse.error('Agent not found');
  }

  private async deleteAgent(reqObject: DeleteAgentDto): Promise<ApiResponse<any>> {
    const customerId = StringUtils.toInt(reqObject.CustomerId);
    
    if (!customerId) {
      return ApiResponse.error('Customer ID is required');
    }

    await this.agentsService.deleteAgent(customerId);
    return ApiResponse.success(null, 'Success');
  }

  private groupByName(agents: any[]): any[] {
    const grouped = agents.reduce((acc, agent) => {
      if (!agent.customerName) return acc;
      
      const firstLetter = agent.customerName.substring(0, 1).toUpperCase();
      
      if (!acc[firstLetter]) {
        acc[firstLetter] = [];
      }
      
      acc[firstLetter].push(agent);
      return acc;
    }, {});

    return Object.keys(grouped)
      .sort()
      .map(alphabet => ({
        Alphabet: alphabet,
        SubList: grouped[alphabet].sort((a, b) => 
          a.customerName.localeCompare(b.customerName)
        ),
      }));
  }
}