import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CarsService } from './cars.service';
import { ApiResponse } from '../shared/dto/api-response.dto';
import { CarRequestDto, GetCarsListDto } from './dto/car.dto';

@Controller('api/SMCar')
@UseGuards(AuthGuard('jwt'))
export class CarsController {
  constructor(private readonly carsService: CarsService) {}

  @Post()
  async post(@Body() body: CarRequestDto): Promise<ApiResponse> {
    try {
      const { reqType, reqObject } = body;

      switch (reqType) {
        case 'SaveCarDetails':
          return await this.handleSaveCarDetails(reqObject);

        case 'GetCarsList':
          return await this.handleGetCarsList(body);

        case 'GetCarDetails':
          return await this.handleGetCarDetails(reqObject);

        case 'GetCarsByCustomerId':
          return await this.handleGetCarsByCustomerId(reqObject);

        case 'DeleteCar':
          return await this.handleDeleteCar(reqObject);

        default:
          return ApiResponse.error('Invalid request type');
      }
    } catch (error) {
      return ApiResponse.error(error.message);
    }
  }

  /**
   * Handle SaveCarDetails request
   */
  private async handleSaveCarDetails(reqObject: any): Promise<ApiResponse> {
    try {
      if (!reqObject) {
        return ApiResponse.error('ReqObject is required');
      }

      const isNew = !reqObject.carId || reqObject.carId <= 0;
      const savedCar = await this.carsService.save(reqObject);

      if (!isNew) {
        // Reload car with all details for update
        const carDetails = await this.carsService.getCarDetails(savedCar.carId);
        return ApiResponse.success(carDetails);
      }

      return ApiResponse.success(savedCar);
    } catch (error) {
      return ApiResponse.error(error.message);
    }
  }

  /**
   * Handle GetCarsList request
   */
  private async handleGetCarsList(body: any): Promise<ApiResponse> {
    try {
      if (!body.reqObject) {
        return ApiResponse.error('ReqObject is required');
      }

      const params: GetCarsListDto = body.reqObject;
      const cars = await this.carsService.getCarsList(params);

      // Get total count if requested
      let totalLength = 0;
      if (body.reqObject.includeTotalRowsLength) {
        totalLength = await this.carsService.getCarsListCount(params);
      }

      return ApiResponse.success({
        totalLength,
        rowsList: cars,
      });
    } catch (error) {
      return ApiResponse.error(error.message);
    }
  }

  /**
   * Handle GetCarDetails request
   */
  private async handleGetCarDetails(reqObject: any): Promise<ApiResponse> {
    try {
      const carId = parseInt(reqObject.carId || reqObject.CarId);

      if (!carId) {
        return ApiResponse.error('CarId is required');
      }

      const carData = await this.carsService.getCarDetails(carId);

      if (carData) {
        return ApiResponse.success(carData);
      }

      return ApiResponse.error('Car not found');
    } catch (error) {
      return ApiResponse.error(error.message);
    }
  }

  /**
   * Handle GetCarsByCustomerId request
   */
  private async handleGetCarsByCustomerId(reqObject: any): Promise<ApiResponse> {
    try {
      const customerId = parseInt(reqObject.customerId || reqObject.CustomerId);

      if (!customerId) {
        return ApiResponse.error('CustomerId is required');
      }

      const params: GetCarsListDto = {
        objectIds: customerId.toString(),
        itemsPerPage: 100, // Get all cars for customer
        pageNumber: 0,
      };

      const cars = await this.carsService.getCarsList(params);
      return ApiResponse.success(cars);
    } catch (error) {
      return ApiResponse.error(error.message);
    }
  }

  /**
   * Handle DeleteCar request
   */
  private async handleDeleteCar(reqObject: any): Promise<ApiResponse> {
    try {
      const carId = parseInt(reqObject.carId || reqObject.CarId);

      if (!carId) {
        return ApiResponse.error('CarId is required');
      }

      await this.carsService.deleteCar(carId);
      return ApiResponse.success(null);
    } catch (error) {
      return ApiResponse.error(error.message);
    }
  }
}