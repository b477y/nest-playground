import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsString, Min } from "class-validator";

export class GetProductsQueryDto {
  @ApiPropertyOptional({ description: "Search based on product title" })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ description: "Minimum product price" })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minPrice?: number;

  @ApiPropertyOptional({ description: "Maximum product price" })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  maxPrice?: number;
}
