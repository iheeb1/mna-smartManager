import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Product } from './product.entity';
import { GetProductsListDto, SaveProductDto } from './dto/product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  /**
   * Get products list with filtering and pagination
   */
  async getProductsList(params: GetProductsListDto): Promise<any[]> {
    const query = this.buildProductsQuery(params);

    // Apply pagination
    const itemsPerPage = params.itemsPerPage || 30;
    const pageNumber = params.pageNumber || 0;

    if (itemsPerPage > 0) {
      const skip = pageNumber * itemsPerPage;
      query.skip(skip).take(itemsPerPage);
    }

    const products = await query.getRawMany();
    return this.mapProductsResponse(products);
  }

  /**
   * Get total count of products matching criteria
   */
  async getProductsListCount(params: GetProductsListDto): Promise<number> {
    const query = this.buildProductsQuery(params);
    return await query.getCount();
  }

  /**
   * Get product details by ID
   */
  async getProductDetails(productId: number): Promise<any> {
    const query = this.buildProductsQuery({ productId });
    const product = await query.getRawOne();
    return product ? this.mapProductResponse(product) : null;
  }

  /**
   * Save (insert or update) product
   */
  async save(productDto: SaveProductDto): Promise<any> {
    try {
      const product = new Product();

      if (productDto.productId && productDto.productId > 0) {
        // Update existing product
        const existingProduct = await this.productRepository.findOne({
          where: { productId: productDto.productId },
        });

        if (!existingProduct) {
          throw new Error('Product not found');
        }

        Object.assign(existingProduct, {
          productCode: productDto.productCode,
          productName: productDto.productName,
          categoryId: productDto.categoryId,
          productSize: productDto.productSize,
          manufacturerId: productDto.manufacturerId,
          brandId: productDto.brandId,
          productPrice: productDto.productPrice,
          productImage: productDto.productImage,
          returnableItem: productDto.returnableItem || 1,
          includeVariants: productDto.includeVariants || 1,
          productVariants: productDto.productVariants
            ? JSON.stringify(productDto.productVariants)
            : null,
          productStatusId: productDto.productStatusId || 1,
          modifiedBy: productDto.modifiedBy || 1,
        });

        const savedProduct = await this.productRepository.save(existingProduct);
        return await this.getProductDetails(savedProduct.productId);
      } else {
        // Insert new product
        Object.assign(product, {
          productCode: productDto.productCode,
          productName: productDto.productName,
          categoryId: productDto.categoryId,
          productSize: productDto.productSize,
          manufacturerId: productDto.manufacturerId,
          brandId: productDto.brandId,
          productPrice: productDto.productPrice,
          productImage: productDto.productImage,
          returnableItem: productDto.returnableItem || 1,
          includeVariants: productDto.includeVariants || 1,
          productVariants: productDto.productVariants
            ? JSON.stringify(productDto.productVariants)
            : null,
          productStatusId: productDto.productStatusId || 1,
          createdBy: productDto.createdBy || 1,
          modifiedBy: productDto.modifiedBy || 1,
        });

        const savedProduct = await this.productRepository.save(product);
        return savedProduct;
      }
    } catch (error) {
      if (error.message.includes('Duplicate entry')) {
        throw new Error('קוד פריט קיים במערכת'); // Product code already exists
      }
      throw error;
    }
  }

  /**
   * Delete product by ID
   */
  async deleteProduct(productId: number): Promise<void> {
    await this.productRepository.delete(productId);
  }

  /**
   * Build query for products with all filters
   */
  private buildProductsQuery(params: GetProductsListDto): SelectQueryBuilder<any> {
    const query = this.productRepository
      .createQueryBuilder('product')
      .leftJoin('mng_lookups', 'category', 'product.CategoryId = category.LookUpId')
      .leftJoin('mng_lookups', 'manufacturer', 'product.ManufacturerId = manufacturer.LookUpId')
      .leftJoin('mng_lookups', 'brand', 'product.BrandId = brand.LookUpId')
      .leftJoin('mng_lookups', 'status', 'product.ProductStatusId = status.LookUpId')
      .select([
        'product.ProductId as productId',
        'product.ProductCode as productCode',
        'product.ProductName as productName',
        'product.CategoryId as categoryId',
        'category.LookUpName as categoryName',
        'product.ProductSize as productSize',
        'product.ManufacturerId as manufacturerId',
        'manufacturer.LookUpName as manufacturerName',
        'product.BrandId as brandId',
        'brand.LookUpName as brandName',
        'product.ProductPrice as productPrice',
        'product.ProductImage as productImage',
        'product.ReturnableItem as returnableItem',
        'product.IncludeVariants as includeVariants',
        'product.ProductVariants as productVariants',
        'product.ProductStatusId as productStatusId',
        'status.LookUpName as productStatusName',
        'product.CreatedBy as createdBy',
        'product.ModifiedBy as modifiedBy',
        'product.CreatedDate as createdDate',
        'product.ModifiedDate as modifiedDate',
      ]);

    // Apply filters
    if (params.productId !== undefined && params.productId >= 0) {
      query.andWhere('product.ProductId = :productId', { productId: params.productId });
    }

    if (params.categoryIds) {
      const ids = params.categoryIds.split(',').map(id => parseInt(id.trim()));
      query.andWhere('product.CategoryId IN (:...categoryIds)', { categoryIds: ids });
    }

    if (params.brandIds) {
      const ids = params.brandIds.split(',').map(id => parseInt(id.trim()));
      query.andWhere('product.BrandId IN (:...brandIds)', { brandIds: ids });
    }

    if (params.productCode) {
      query.andWhere('product.ProductCode LIKE :productCode', {
        productCode: `%${params.productCode}%`,
      });
    }

    if (params.productName) {
      query.andWhere('product.ProductName LIKE :productName', {
        productName: `%${params.productName}%`,
      });
    }

    if (params.returnableItem !== undefined && params.returnableItem >= 0) {
      query.andWhere('product.ReturnableItem = :returnableItem', {
        returnableItem: params.returnableItem,
      });
    }

    if (params.productStatusIds) {
      const ids = params.productStatusIds.split(',').map(id => parseInt(id.trim()));
      query.andWhere('product.ProductStatusId IN (:...statusIds)', { statusIds: ids });
    }

    if (params.createdById !== undefined && params.createdById >= 0) {
      query.andWhere('product.CreatedBy = :createdById', { createdById: params.createdById });
    }

    if (params.modifiedById !== undefined && params.modifiedById >= 0) {
      query.andWhere('product.ModifiedBy = :modifiedById', { modifiedById: params.modifiedById });
    }

    if (params.fromCreatedDate) {
      query.andWhere('product.CreatedDate >= :fromCreatedDate', {
        fromCreatedDate: params.fromCreatedDate,
      });
    }

    if (params.toCreatedDate) {
      query.andWhere('product.CreatedDate <= :toCreatedDate', {
        toCreatedDate: params.toCreatedDate,
      });
    }

    if (params.fromModifiedDate) {
      query.andWhere('product.ModifiedDate >= :fromModifiedDate', {
        fromModifiedDate: params.fromModifiedDate,
      });
    }

    if (params.toModifiedDate) {
      query.andWhere('product.ModifiedDate <= :toModifiedDate', {
        toModifiedDate: params.toModifiedDate,
      });
    }

    query.orderBy('product.CreatedDate', 'DESC');

    return query;
  }

  /**
   * Map raw database results to response format
   */
  private mapProductsResponse(products: any[]): any[] {
    return products.map(product => this.mapProductResponse(product));
  }

  /**
   * Map single product to response format
   */
  private mapProductResponse(product: any): any {
    return {
      productId: product.productId,
      productCode: product.productCode || '',
      productName: product.productName || '',
      category: {
        lookUpId: product.categoryId || 0,
        lookUpName: product.categoryName || '',
      },
      productSize: product.productSize || '',
      manufacturer: {
        lookUpId: product.manufacturerId || 0,
        lookUpName: product.manufacturerName || '',
      },
      brand: {
        lookUpId: product.brandId || 0,
        lookUpName: product.brandName || '',
      },
      productPrice: parseFloat(product.productPrice) || 0,
      productImage: product.productImage || '',
      returnableItem: product.returnableItem || 0,
      includeVariants: product.includeVariants || 0,
      productVariants: product.productVariants
        ? JSON.parse(product.productVariants)
        : null,
      productStatus: {
        lookUpId: product.productStatusId || 0,
        lookUpName: product.productStatusName || '',
      },
      createdBy: product.createdBy,
      modifiedBy: product.modifiedBy,
      createdDate: product.createdDate,
      modifiedDate: product.modifiedDate,
    };
  }
}