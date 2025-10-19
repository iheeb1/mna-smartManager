import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ProductsService } from './products.service';
import { ApiResponse } from '../shared/dto/api-response.dto';
import { ProductRequestDto, GetProductsListDto } from './dto/product.dto';

@Controller('api/SMProduct')
@UseGuards(AuthGuard('jwt'))
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  async post(@Body() body: ProductRequestDto): Promise<ApiResponse> {

    try {
      const { reqType, reqObject } = body;

      switch (reqType) {
        case 'SaveProductDetails':
          return await this.handleSaveProductDetails(reqObject);

        case 'GetProductsList':
          return await this.handleGetProductsList(body);

        case 'GetProductDetails':
          return await this.handleGetProductDetails(reqObject);

        case 'DeleteProduct':
          return await this.handleDeleteProduct(reqObject);

        default:
          return ApiResponse.error('Invalid request type');
      }
    } catch (error) {
      return ApiResponse.error(error.message);
    }
  }

  /**
   * Handle SaveProductDetails request
   */
  private async handleSaveProductDetails(reqObject: any): Promise<ApiResponse> {
    try {
      if (!reqObject) {
        return ApiResponse.error('ReqObject is required');
      }

      const savedProduct = await this.productsService.save(reqObject);
      return ApiResponse.success(savedProduct);
    } catch (error) {
      if (error.message.includes('קוד פריט קיים במערכת')) {
        return {
          success: false,
          errorMessage: error.message,
          data: null,
          fieldsControls: {
            isValid: false,
            productCode: {
              isValid: false,
              errorMessage: error.message,
            },
          },
        } as any;
      }
      return ApiResponse.error(error.message);
    }
  }

  /**
   * Handle GetProductsList request
   */
  private async handleGetProductsList(body: any): Promise<ApiResponse> {
    try {
      if (!body.reqObject) {
        return ApiResponse.error('ReqObject is required');
      }

      const params: GetProductsListDto = body.reqObject;
      const products = await this.productsService.getProductsList(params);

      let totalLength = 0;
      if (body.reqObject.includeTotalRowsLength) {
        totalLength = await this.productsService.getProductsListCount(params);
      }

      return ApiResponse.success({
        totalLength,
        rowsList: products,
      });
    } catch (error) {
      return ApiResponse.error(error.message);
    }
  }

  /**
   * Handle GetProductDetails request
   */
  private async handleGetProductDetails(reqObject: any): Promise<ApiResponse> {
    try {
      const productId = parseInt(reqObject.productId || reqObject.ProductId);

      if (!productId) {
        return ApiResponse.error('ProductId is required');
      }

      const productData = await this.productsService.getProductDetails(productId);

      if (productData) {
        return ApiResponse.success(productData);
      }

      return ApiResponse.error('Product not found');
    } catch (error) {
      return ApiResponse.error(error.message);
    }
  }

  /**
   * Handle DeleteProduct request
   */
  private async handleDeleteProduct(reqObject: any): Promise<ApiResponse> {
    try {
      const productId = parseInt(reqObject.productId || reqObject.ProductId);

      if (!productId) {
        return ApiResponse.error('ProductId is required');
      }

      await this.productsService.deleteProduct(productId);
      return ApiResponse.success(null);
    } catch (error) {
      return ApiResponse.error(error.message);
    }
  }
}