import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from './entities/customer.entity';
import { SaveCustomerDto, CustomerSearchDto } from './dto/customer.dto';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
  ) {}

  async saveCustomer(customerDto: SaveCustomerDto): Promise<Customer> {
    const customer = this.customerRepository.create(customerDto);
    return await this.customerRepository.save(customer);
  }

  async getCustomersList(searchDto: CustomerSearchDto): Promise<{
    customers: Customer[];
    totalLength?: number;
    grouped?: any;
  }> {
    const query = this.customerRepository.createQueryBuilder('customer');

    this.applyFilters(query, searchDto);

    const itemsPerPage = searchDto.ItemsPerPage || 10;
    const pageNumber = searchDto.PageNumber || 1;

    if (itemsPerPage > 0 && pageNumber > 0) {
      query
        .skip((pageNumber - 1) * itemsPerPage)
        .take(itemsPerPage);
    }

    const customers = await query.getMany();

    let totalLength = 0;
    if (searchDto.IncludeTotalRowsLength) {
      const countQuery = this.customerRepository.createQueryBuilder('customer');
      this.applyFilters(countQuery, searchDto);
      totalLength = await countQuery.getCount();
    }

    if (searchDto.GroupBy === 'Name') {
      const grouped = this.groupByName(customers);
      return { customers: [], totalLength, grouped };
    }

    return { customers, totalLength };
  }

  async getCustomerDetails(customerId: number): Promise<Customer> {
    const customer = await this.customerRepository.findOne({
      where: { customerId },
    });

    if (!customer) {
      throw new NotFoundException(`Customer with ID ${customerId} not found`);
    }

    return customer;
  }

  async deleteCustomer(customerId: number): Promise<void> {
    const result = await this.customerRepository.delete(customerId);
    if (result.affected === 0) {
      throw new NotFoundException(`Customer with ID ${customerId} not found`);
    }
  }

  async deleteCustomerTransactions(customerId: number): Promise<void> {
    console.log(`Deleting transactions for customer ${customerId}`);
  }

  async deleteCustomers(customerIds: string): Promise<void> {
    const ids = customerIds.split(',').map(id => parseInt(id.trim()));
    await this.customerRepository.delete(ids);
  }

  async changeCustomersStatus(customerIds: string, statusId: number): Promise<void> {
    const ids = customerIds.split(',').map(id => parseInt(id.trim()));
    await this.customerRepository
      .createQueryBuilder()
      .update(Customer)
      .set({ customerStatusId: statusId })
      .whereInIds(ids)
      .execute();
  }

  private applyFilters(query: any, searchDto: CustomerSearchDto): void {
    if (searchDto.CustomerIds) {
      const ids = searchDto.CustomerIds.split(',').map(id => parseInt(id.trim()));
      query.andWhere('customer.customerId IN (:...ids)', { ids });
    }

    if (searchDto.CustomerParentIds) {
      const parentIds = searchDto.CustomerParentIds.split(',').map(id => parseInt(id.trim()));
      query.andWhere('customer.customerParentId IN (:...parentIds)', { parentIds });
    }

    if (searchDto.CustomerStatusIds) {
      const statusIds = searchDto.CustomerStatusIds.split(',').map(id => parseInt(id.trim()));
      query.andWhere('customer.customerStatusId IN (:...statusIds)', { statusIds });
    }

    if (searchDto.CustomerType?.LookUpIds) {
      const typeIds = searchDto.CustomerType.LookUpIds.split(',').map(id => parseInt(id.trim()));
      query.andWhere('customer.customerTypeId IN (:...typeIds)', { typeIds });
    }

    if (searchDto.CustomerIdz) {
      query.andWhere('customer.customerIdz LIKE :customerIdz', {
        customerIdz: `%${searchDto.CustomerIdz}%`,
      });
    }

    if (searchDto.CustomerName) {
      query.andWhere('customer.customerName LIKE :customerName', {
        customerName: `%${searchDto.CustomerName}%`,
      });
    }

    if (searchDto.CustomerPhoneNumber) {
      query.andWhere('customer.customerPhoneNumber LIKE :customerPhoneNumber', {
        customerPhoneNumber: `%${searchDto.CustomerPhoneNumber}%`,
      });
    }

    if (searchDto.CustomerMobileNumber) {
      query.andWhere('customer.customerMobileNumber LIKE :customerMobileNumber', {
        customerMobileNumber: `%${searchDto.CustomerMobileNumber}%`,
      });
    }

    if (searchDto.CustomerFaxNumber) {
      query.andWhere('customer.customerFaxNumber LIKE :customerFaxNumber', {
        customerFaxNumber: `%${searchDto.CustomerFaxNumber}%`,
      });
    }

    if (searchDto.CustomerCity) {
      query.andWhere('customer.customerCity LIKE :customerCity', {
        customerCity: `%${searchDto.CustomerCity}%`,
      });
    }

    if (searchDto.CustomerCountry) {
      query.andWhere('customer.customerCountry LIKE :customerCountry', {
        customerCountry: `%${searchDto.CustomerCountry}%`,
      });
    }

    if (searchDto.CreatedBy?.UserIds) {
      const createdByIds = searchDto.CreatedBy.UserIds.split(',').map(id => parseInt(id.trim()));
      query.andWhere('customer.createdBy IN (:...createdByIds)', { createdByIds });
    }

    if (searchDto.ModifiedBy?.UserIds) {
      const modifiedByIds = searchDto.ModifiedBy.UserIds.split(',').map(id => parseInt(id.trim()));
      query.andWhere('customer.modifiedBy IN (:...modifiedByIds)', { modifiedByIds });
    }

    if (searchDto.CreatedDate?.FromDate) {
      query.andWhere('customer.createdDate >= :fromCreatedDate', {
        fromCreatedDate: searchDto.CreatedDate.FromDate,
      });
    }

    if (searchDto.CreatedDate?.ToDate) {
      query.andWhere('customer.createdDate <= :toCreatedDate', {
        toCreatedDate: searchDto.CreatedDate.ToDate,
      });
    }

    if (searchDto.ModifiedDate?.FromDate) {
      query.andWhere('customer.modifiedDate >= :fromModifiedDate', {
        fromModifiedDate: searchDto.ModifiedDate.FromDate,
      });
    }

    if (searchDto.ModifiedDate?.ToDate) {
      query.andWhere('customer.modifiedDate <= :toModifiedDate', {
        toModifiedDate: searchDto.ModifiedDate.ToDate,
      });
    }
  }

  private groupByName(customers: Customer[]): any[] {
    const grouped = new Map<string, Customer[]>();

    customers.forEach(customer => {
      if (customer.customerName) {
        const firstLetter = customer.customerName.charAt(0).toUpperCase();
        if (!grouped.has(firstLetter)) {
          grouped.set(firstLetter, []);
        }
        grouped.get(firstLetter)!.push(customer);
      }
    });

    return Array.from(grouped.entries())
      .map(([alphabet, subList]) => ({
        Alphabet: alphabet,
        SubList: subList.sort((a, b) => 
          a.customerName.localeCompare(b.customerName)
        ),
      }))
      .sort((a, b) => a.Alphabet.localeCompare(b.Alphabet));
  }
}