import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginUserDto {
  @ApiProperty({ description: 'The email of the user' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'The password of the user' })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password: string;
}