import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
  Min,
  MinLength,
} from 'class-validator';

export class CreateReviewDto {
  @IsNumber()
  @Min(0, { message: "Rating shouldn't be less than zero" })
  rating: number;

  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  comment: string;
}
