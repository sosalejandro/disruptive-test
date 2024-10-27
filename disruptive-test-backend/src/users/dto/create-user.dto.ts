import { IsEmail, IsEnum, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { UserType } from '@/enums';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: 'The username of the user' })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({ description: 'The email of the user' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'The password of the user', minLength: 6 })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({ description: 'The type of the user', enum: UserType })
  @IsNotEmpty()
  @IsEnum(UserType)
  userType: UserType;
}
