import { ApiProperty } from "@nestjs/swagger";
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
  Min,
  MinLength,
} from "class-validator";

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @Length(2, 150)
  @ApiProperty()
  title: string;

  @IsNumber()
  @Min(0, { message: "Price shouldn't be less than zero" })
  @ApiProperty()
  price: number;

  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @ApiProperty()
  description: string;
}
