import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  Length,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @IsEmail()
  @MaxLength(250)
  @IsNotEmpty()
  email: string;

  @IsStrongPassword()
  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  @IsString()
  @Length(2, 150)
  username: string;
}
