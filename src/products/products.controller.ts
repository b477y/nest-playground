import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  ParseIntPipe,
  UseGuards,
  Query,
} from "@nestjs/common";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { ProductsService } from "./products.service";
import { ConfigService } from "@nestjs/config";
import { CurrentUser } from "src/users/decorators/current-user.decorator";
import { AuthRolesGuard } from "src/users/guards/auth-roles.guard";
import type { JWTPayloadType } from "src/utils/types";
import { Roles } from "src/users/decorators/user.role.decorator";
import { UserType } from "src/utils/enums";
import {
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiSecurity,
} from "@nestjs/swagger";
import { GetProductsQueryDto } from "./dto/get-product.dto";

@Controller("products")
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly configService: ConfigService
  ) {}

  @Post()
  @Roles(UserType.ADMIN)
  @UseGuards(AuthRolesGuard)
  createProduct(
    @CurrentUser() payload: JWTPayloadType,
    @Body() createProductDto: CreateProductDto
  ) {
    return this.productsService.createProduct(payload.id, createProductDto);
  }

  @Get()
  @ApiResponse({ status: 200 })
  @ApiOperation({ summary: "List the products" })
  getAll(@Query() query: GetProductsQueryDto) {
    return this.productsService.getAll(
      query.title,
      query.minPrice,
      query.maxPrice
    );
  }

  @Get(":id")
  getOneById(@Param("id", ParseIntPipe) id: number) {
    return this.productsService.getOneById(id);
  }

  @Put(":id")
  @Roles(UserType.ADMIN)
  @UseGuards(AuthRolesGuard)
  @ApiSecurity("bearer")
  updateProduct(
    @CurrentUser() payload: JWTPayloadType,
    @Param("id", ParseIntPipe) id: number,
    @Body()
    updateProductDto: UpdateProductDto
  ) {
    return this.productsService.updateProduct(payload, id, updateProductDto);
  }

  @Delete(":id")
  @Roles(UserType.ADMIN)
  @UseGuards(AuthRolesGuard)
  deleteProduct(
    @CurrentUser() payload: JWTPayloadType,
    @Param("id", ParseIntPipe) id: number
  ) {
    return this.productsService.deleteProduct(payload, id);
  }
}
