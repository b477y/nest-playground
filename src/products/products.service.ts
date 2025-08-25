import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { Product } from "./product.entity";
import {
  Repository,
  Like,
  Between,
  MoreThanOrEqual,
  LessThanOrEqual,
} from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/users/user.entity";
import { JWTPayloadType } from "src/utils/types";

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>
  ) {}

  /**
   * Create new product
   */
  async createProduct(userId: number, createProductDto: CreateProductDto) {
    createProductDto.title = createProductDto.title.toLowerCase();

    const newProduct = this.productRepository.create({
      ...createProductDto,
      title: createProductDto.title.toLowerCase(),
      user: { id: userId } as User,
    });
    return this.productRepository.save(newProduct);
  }

  /**
   * Get all products
   */
  getAll(title?: string, minPrice?: number, maxPrice?: number) {
    const filters: any = {};

    if (title) {
      filters.title = Like(`%${title.toLocaleLowerCase()}%`);
    }

    if (minPrice && maxPrice) {
      filters.price = Between(minPrice, maxPrice);
    } else if (minPrice) {
      filters.price = MoreThanOrEqual(minPrice);
    } else if (maxPrice) {
      filters.price = LessThanOrEqual(maxPrice);
    }

    return this.productRepository.findBy(filters);
  }

  /**
   * Get product by id
   */
  async getOneById(id: number) {
    const product = await this.productRepository.findOneBy({ id });
    if (!product) {
      throw new NotFoundException(`Product with id ${id} was not found`);
    }
    return product;
  }

  /**
   * Update product by id
   */
  async updateProduct(
    payload: JWTPayloadType,
    id: number,
    updateProductDto: UpdateProductDto
  ) {
    const product = await this.getOneById(id);

    if (payload.id !== product.user.id) {
      throw new UnauthorizedException(
        `You are not authorized to update this product. Only the owner can update it`
      );
    }

    Object.assign(product, updateProductDto);
    return this.productRepository.save(product);
  }

  /**
   * Delete product by id
   * @param id id of the products
   * @returns success message
   */
  async deleteProduct(payload: JWTPayloadType, id: number) {
    const product = await this.getOneById(id);

    if (payload.id !== product.user.id) {
      throw new UnauthorizedException(
        `You are not authorized to delete this product. Only the owner can delete it`
      );
    }

    await this.productRepository.remove(product);
    return { message: "Product deleted successfully" };
  }
}
