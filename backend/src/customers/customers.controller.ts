import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { CustomerService } from './customers.service';
import { CustomerRequestDto, SaveCustomerDto, CustomerSearchDto } from './dto/customer.dto';
import { CustomerRequestType } from '../shared/enums/customer.enum';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('api/smcustomer')
@UseGuards(JwtAuthGuard)
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post()
  async handleRequest(@Body() requestDto: CustomerRequestDto) {
    switch (requestDto.ReqType) {
      case CustomerRequestType.SaveCustomerDetails:
        return await this.saveCustomerDetails(requestDto.ReqObject);

      case CustomerRequestType.GetCustomersList:
        return await this.getCustomersList(requestDto.ReqObject);

      case CustomerRequestType.GetCustomerDetails:
        return await this.getCustomerDetails(requestDto.ReqObject);

      case CustomerRequestType.DeleteCustomer:
        return await this.deleteCustomer(requestDto.ReqObject);

      case CustomerRequestType.DeleteCustomerTransactions:
        return await this.deleteCustomerTransactions(requestDto.ReqObject);

      case CustomerRequestType.DeleteCustomers:
        return await this.deleteCustomers(requestDto.ReqObject);

      case CustomerRequestType.ChangeCustomersStatus:
        return await this.changeCustomersStatus(requestDto.ReqObject);

      default:
        throw new Error('Invalid request type');
    }
  }

  private async saveCustomerDetails(reqObject: SaveCustomerDto) {
    if (!reqObject) {
      throw new Error('Request object is required');
    }

    return await this.customerService.saveCustomer(reqObject);
  }

  private async getCustomersList(reqObject: CustomerSearchDto) {
    if (!reqObject) {
      throw new Error('Request object is required');
    }

    const result = await this.customerService.getCustomersList(reqObject);

    if (reqObject.GroupBy === 'Name' && result.grouped) {
      return {
        TotalLength: result.totalLength || 0,
        RowsList: result.grouped,
      };
    }

    return {
      TotalLength: result.totalLength || 0,
      RowsList: result.customers,
    };
  }

  private async getCustomerDetails(reqObject: { CustomerId: number }) {
    return await this.customerService.getCustomerDetails(reqObject.CustomerId);
  }

  private async deleteCustomer(reqObject: { CustomerId: number }) {
    await this.customerService.deleteCustomer(reqObject.CustomerId);
    return { success: true };
  }

  private async deleteCustomerTransactions(reqObject: { CustomerId: number }) {
    await this.customerService.deleteCustomerTransactions(reqObject.CustomerId);
    return { success: true };
  }

  private async deleteCustomers(reqObject: { CustomerIds: string }) {
    await this.customerService.deleteCustomers(reqObject.CustomerIds);
    return { success: true };
  }

  private async changeCustomersStatus(reqObject: { CustomerIds: string; StatusId: number }) {
    await this.customerService.changeCustomersStatus(reqObject.CustomerIds, reqObject.StatusId);
    return { success: true };
  }
}