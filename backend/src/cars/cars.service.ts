import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Car } from './car.entity';
import { GetCarsListDto, SaveCarDto } from './dto/car.dto';

@Injectable()
export class CarsService {
  constructor(
    @InjectRepository(Car)
    private readonly carRepository: Repository<Car>,
  ) {}

  /**
   * Get cars list with filtering and pagination
   */
  async getCarsList(params: GetCarsListDto): Promise<any[]> {
    const query = this.buildCarsQuery(params);

    // Apply pagination
    const itemsPerPage = params.itemsPerPage || 30;
    const pageNumber = params.pageNumber || 0;
    
    if (itemsPerPage > 0) {
      const skip = pageNumber * itemsPerPage;
      query.skip(skip).take(itemsPerPage);
    }

    const cars = await query.getRawMany();
    return this.mapCarsResponse(cars);
  }

  /**
   * Get total count of cars matching criteria
   */
  async getCarsListCount(params: GetCarsListDto): Promise<number> {
    const query = this.buildCarsQuery(params);
    return await query.getCount();
  }

  /**
   * Get car details by ID
   */
  async getCarDetails(carId: number): Promise<any> {
    const query = this.carRepository
      .createQueryBuilder('car')
      .leftJoin('mng_customers', 'customer', 'car.ObjectId = customer.CustomerId')
      .select([
        'car.CarId as carId',
        'car.ObjectId as objectId',
        'car.CarStatusId as carStatusId',
        'car.CarNumber as carNumber',
        'car.CarNotes as carNotes',
        'car.CreatedBy as createdBy',
        'car.ModifiedBy as modifiedBy',
        'car.CreatedDate as createdDate',
        'car.ModifiedDate as modifiedDate',
        'customer.CustomerName as customerName',
        'customer.CustomerIdz as customerIdz',
      ])
      .where('car.CarId = :carId', { carId });

    const car = await query.getRawOne();
    return car ? this.mapCarResponse(car) : null;
  }

  /**
   * Save (insert or update) car
   */
  async save(carDto: SaveCarDto): Promise<Car> {
    const car = new Car();

    if (carDto.carId && carDto.carId > 0) {
      // Update existing car
      const existingCar = await this.carRepository.findOne({
        where: { carId: carDto.carId },
      });

      if (!existingCar) {
        throw new Error('Car not found');
      }

      Object.assign(existingCar, {
        objectId: carDto.objectId,
        carStatusId: carDto.carStatusId,
        carNumber: carDto.carNumber,
        carNotes: carDto.carNotes,
        modifiedBy: carDto.modifiedBy || 1,
      });

      return await this.carRepository.save(existingCar);
    } else {
      // Insert new car
      Object.assign(car, {
        objectId: carDto.objectId,
        carStatusId: carDto.carStatusId || 0,
        carNumber: carDto.carNumber,
        carNotes: carDto.carNotes,
        createdBy: carDto.createdBy || 1,
        modifiedBy: carDto.modifiedBy || 1,
      });

      return await this.carRepository.save(car);
    }
  }

  /**
   * Delete car by ID
   */
  async deleteCar(carId: number): Promise<void> {
    await this.carRepository.delete(carId);
  }

  /**
   * Build query for cars with all filters
   */
  private buildCarsQuery(params: GetCarsListDto): SelectQueryBuilder<any> {
    const query = this.carRepository
      .createQueryBuilder('car')
      .leftJoin('mng_customers', 'customer', 'car.ObjectId = customer.CustomerId')
      .select([
        'car.CarId as carId',
        'car.ObjectId as objectId',
        'car.CarStatusId as carStatusId',
        'car.CarNumber as carNumber',
        'car.CarNotes as carNotes',
        'car.CreatedBy as createdBy',
        'car.ModifiedBy as modifiedBy',
        'car.CreatedDate as createdDate',
        'car.ModifiedDate as modifiedDate',
        'customer.CustomerName as customerName',
        'customer.CustomerIdz as customerIdz',
      ]);

    // Apply filters
    if (params.carIds) {
      const ids = params.carIds.split(',').map(id => parseInt(id.trim()));
      query.andWhere('car.CarId IN (:...ids)', { ids });
    }

    if (params.objectIds) {
      const ids = params.objectIds.split(',').map(id => parseInt(id.trim()));
      query.andWhere('car.ObjectId IN (:...objectIds)', { objectIds: ids });
    }

    if (params.carStatusIds) {
      const ids = params.carStatusIds.split(',').map(id => parseInt(id.trim()));
      query.andWhere('car.CarStatusId IN (:...statusIds)', { statusIds: ids });
    }

    if (params.carNumber) {
      query.andWhere('car.CarNumber LIKE :carNumber', {
        carNumber: `%${params.carNumber}%`,
      });
    }

    if (params.createdByIds) {
      const ids = params.createdByIds.split(',').map(id => parseInt(id.trim()));
      query.andWhere('car.CreatedBy IN (:...createdByIds)', { createdByIds: ids });
    }

    if (params.modifiedByIds) {
      const ids = params.modifiedByIds.split(',').map(id => parseInt(id.trim()));
      query.andWhere('car.ModifiedBy IN (:...modifiedByIds)', { modifiedByIds: ids });
    }

    if (params.fromCreatedDate) {
      query.andWhere('car.CreatedDate >= :fromCreatedDate', {
        fromCreatedDate: params.fromCreatedDate,
      });
    }

    if (params.toCreatedDate) {
      query.andWhere('car.CreatedDate <= :toCreatedDate', {
        toCreatedDate: params.toCreatedDate,
      });
    }

    if (params.fromModifiedDate) {
      query.andWhere('car.ModifiedDate >= :fromModifiedDate', {
        fromModifiedDate: params.fromModifiedDate,
      });
    }

    if (params.toModifiedDate) {
      query.andWhere('car.ModifiedDate <= :toModifiedDate', {
        toModifiedDate: params.toModifiedDate,
      });
    }

    // Order by most recent first
    query.orderBy('car.CreatedDate', 'DESC');

    return query;
  }

  /**
   * Map raw database results to response format
   */
  private mapCarsResponse(cars: any[]): any[] {
    return cars.map(car => this.mapCarResponse(car));
  }

  /**
   * Map single car to response format
   */
  private mapCarResponse(car: any): any {
    return {
      carId: car.carId,
      objectId: car.objectId,
      carStatusId: car.carStatusId,
      carNumber: car.carNumber,
      carNotes: car.carNotes,
      createdBy: car.createdBy,
      modifiedBy: car.modifiedBy,
      createdDate: car.createdDate,
      modifiedDate: car.modifiedDate,
      customer: {
        customerId: car.objectId,
        customerName: car.customerName || '',
        customerIdz: car.customerIdz || '',
      },
    };
  }
}