import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
  Length,
  MaxLength,
} from 'class-validator';
import { UserType } from 'src/utils/enums';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  @Length(2, 150)
  username?: string;

//   @IsEmail()
//   @IsOptional()
//   @MaxLength(250)
//   @IsNotEmpty()
//   email?: string;

  @IsStrongPassword()
  @IsOptional()
  @IsNotEmpty()
  password?: string;

//   @IsString()
//   @IsOptional()
//   @IsNotEmpty()
//   userType?: UserType;
}
