import { ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Min,
  MinLength,
} from "class-validator";

export class UpdateProductDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @Length(2, 150)
  @ApiPropertyOptional()
  title?: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @IsOptional()
  @ApiPropertyOptional()
  price?: number;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @MinLength(5)
  @ApiPropertyOptional()
  description?: string;
}
